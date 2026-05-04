(function recordsSkeletonOverlay() {
    // Rajagopal下肢骨骼关节索引
    const JOINT_INDEX = {
        pelvis: 0,
        hip_r: 1,
        knee_r: 2,
        ankle_r: 3,
        calcn_r: 4,
        mtp_r: 5,
        hip_l: 6,
        knee_l: 7,
        ankle_l: 8,
        calcn_l: 9,
        mtp_l: 10
    };

    // 完整的下肢骨骼连接关系 - 基于Rajagopal模型
    const SKELETON_LINKS = [
        // 骨盆到左右髋关节
        { from: "hip_l", to: "pelvis", color: 0x6ee7f9, width: 3.2, label: "左髋" },
        { from: "pelvis", to: "hip_r", color: 0x93c5fd, width: 3.2, label: "右髋" },
        // 左腿骨骼链
        { from: "hip_l", to: "knee_l", color: 0x6ee7f9, width: 2.8, label: "左股骨" },
        { from: "knee_l", to: "ankle_l", color: 0x6ee7f9, width: 2.4, label: "左胫骨" },
        { from: "ankle_l", to: "calcn_l", color: 0x99f6e4, width: 1.8, label: "左跟骨" },
        { from: "calcn_l", to: "mtp_l", color: 0x99f6e4, width: 1.4, label: "左跖骨" },
        // 右腿骨骼链
        { from: "hip_r", to: "knee_r", color: 0x93c5fd, width: 2.8, label: "右股骨" },
        { from: "knee_r", to: "ankle_r", color: 0x93c5fd, width: 2.4, label: "右胫骨" },
        { from: "ankle_r", to: "calcn_r", color: 0xbfdbfe, width: 1.8, label: "右跟骨" },
        { from: "calcn_r", to: "mtp_r", color: 0xbfdbfe, width: 1.4, label: "右跖骨" }
    ];

    // 足部关节集合
    const FOOT_JOINTS = new Set(["ankle_r", "calcn_r", "mtp_r", "ankle_l", "calcn_l", "mtp_l"]);

    // 主要关节（髋、膝、踝）
    const MAJOR_JOINTS = new Set(["hip_r", "hip_l", "knee_r", "knee_l", "ankle_r", "ankle_l"]);

    // 骨骼段标签
    const SEGMENT_LABELS = {
        hip_l: "左髋关节",
        hip_r: "右髋关节",
        knee_l: "左膝关节",
        knee_r: "右膝关节",
        ankle_l: "左踝关节",
        ankle_r: "右踝关节",
        calcn_l: "左跟骨",
        calcn_r: "右跟骨",
        mtp_l: "左跖骨",
        mtp_r: "右跖骨",
        pelvis: "骨盆"
    };

    const state = {
        enabled: true,
        initialized: false,
        button: null,
        helperCopy: null,
        overlay: null,
        frameLoopId: 0,
        showLabels: false,
        pulsePhase: 0
    };

    function boot() {
        const appState = window.recordsAppState;
        if (!window.THREE || !appState || !appState.rig || !appState.rig.root) {
            requestAnimationFrame(boot);
            return;
        }

        if (!state.initialized) {
            state.initialized = true;
            state.button = ensureToggleButton();
            state.overlay = buildOverlay(appState);
            appState.rig.root.add(state.overlay.group);
            updatePresentationState();
            tick();
        }
    }

    function ensureToggleButton() {
        let button = document.getElementById("toggle-skeleton-mode");
        if (!button) {
            const toolRegion = document.querySelector(".viewer-tools");
            if (toolRegion) {
                button = document.createElement("button");
                button.type = "button";
                button.id = "toggle-skeleton-mode";
                button.className = "tool-btn active";
                toolRegion.appendChild(button);
            }
        }

        if (button && !button.dataset.bound) {
            button.dataset.bound = "true";
            button.addEventListener("click", () => {
                state.enabled = !state.enabled;
                updatePresentationState();
            });
        }

        return button;
    }

    function buildOverlay(appState) {
        const group = new THREE.Group();
        group.name = "records-skeleton-overlay";

        // 创建关节球体
        const joints = {};
        Object.entries(JOINT_INDEX).forEach(([name]) => {
            const isFoot = FOOT_JOINTS.has(name);
            const isMajor = MAJOR_JOINTS.has(name);
            const isPelvis = name === "pelvis";

            // 根据关节类型设置不同大小
            let radius = 2.3;
            if (isPelvis) radius = 4.0;
            else if (isMajor) radius = 3.2;
            else if (isFoot) radius = 2.7;

            const geometry = new THREE.SphereGeometry(radius, 24, 24);

            // 根据关节类型设置不同颜色
            let color = 0xe2e8f0;
            let emissiveColor = 0x22d3ee;
            if (isPelvis) {
                color = 0xf8fafc;
                emissiveColor = 0x10b981;
            } else if (isFoot) {
                color = 0xf8fafc;
                emissiveColor = 0x6ee7f9;
            } else if (isMajor) {
                color = 0xf1f5f9;
                emissiveColor = 0x93c5fd;
            }

            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.95
            });

            const node = new THREE.Mesh(geometry, material);
            node.renderOrder = 12;
            node.userData = {
                name: name,
                label: SEGMENT_LABELS[name] || name,
                baseColor: color,
                emissiveColor: emissiveColor,
                isMajor: isMajor || isPelvis
            };
            joints[name] = node;
            group.add(node);
        });

        // 创建骨骼连接线 - 使用圆柱体代替线条，更真实
        const links = SKELETON_LINKS.map((link) => {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(6);
            geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

            const line = new THREE.Line(
                geometry,
                new THREE.LineBasicMaterial({
                    color: link.color,
                    transparent: true,
                    opacity: 0.92,
                    linewidth: link.width
                })
            );
            line.renderOrder = 11;
            line.userData = { label: link.label };
            group.add(line);

            return {
                from: link.from,
                to: link.to,
                positions,
                line,
                color: link.color,
                width: link.width
            };
        });

        // 骨盆光环
        const pelvisHalo = new THREE.Mesh(
            new THREE.RingGeometry(7.4, 9.8, 64),
            new THREE.MeshBasicMaterial({
                color: 0x67e8f9,
                transparent: true,
                opacity: 0.35,
                side: THREE.DoubleSide
            })
        );
        pelvisHalo.rotation.x = -Math.PI / 2;
        pelvisHalo.renderOrder = 10;
        group.add(pelvisHalo);

        // 骨盆中心标记
        const pelvisCenter = new THREE.Mesh(
            new THREE.CircleGeometry(3.5, 32),
            new THREE.MeshBasicMaterial({
                color: 0x10b981,
                transparent: true,
                opacity: 0.25,
                side: THREE.DoubleSide
            })
        );
        pelvisCenter.rotation.x = -Math.PI / 2;
        pelvisCenter.position.y = -0.5;
        pelvisCenter.renderOrder = 9;
        group.add(pelvisCenter);

        // 创建关节标签精灵（可选显示）
        const labels = {};
        Object.entries(JOINT_INDEX).forEach(([name]) => {
            if (MAJOR_JOINTS.has(name) || name === "pelvis") {
                const canvas = document.createElement("canvas");
                canvas.width = 128;
                canvas.height = 48;
                const ctx = canvas.getContext("2d");
                ctx.fillStyle = "rgba(15, 35, 60, 0.85)";
                ctx.roundRect(0, 0, 128, 48, 8);
                ctx.fill();
                ctx.fillStyle = "#22d3ee";
                ctx.font = "bold 18px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(SEGMENT_LABELS[name] || name, 64, 24);

                const texture = new THREE.CanvasTexture(canvas);
                const spriteMaterial = new THREE.SpriteMaterial({
                    map: texture,
                    transparent: true,
                    opacity: 0
                });
                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.scale.set(20, 7.5, 1);
                sprite.visible = false;
                labels[name] = sprite;
                group.add(sprite);
            }
        });

        return {
            group,
            joints,
            links,
            pelvisHalo,
            pelvisCenter,
            labels
        };
    }

    function updatePresentationState() {
        const appState = window.recordsAppState;
        if (!appState || !appState.rig) {
            return;
        }

        if (state.button) {
            state.button.textContent = state.enabled ? "骨架模式" : "模型模式";
            state.button.classList.toggle("active", state.enabled);
            state.button.title = state.enabled ? "当前优先展示骨架联动" : "当前优先展示模型表面";
        }

        if (appState.ui && appState.ui.viewerCopy) {
            appState.ui.viewerCopy.textContent = state.enabled
                ? "当前启用骨架增强视图，突出髋-膝-踝-足部联动，展示步态节律、支撑转换与关节关系。"
                : "当前启用模型表面视图，保留 Rajagopal 下肢几何与足底受力、阶段变化的整体展示效果。";
        }

        if (state.overlay) {
            state.overlay.group.visible = state.enabled;
        }

        // 调整模型透明度
        Object.values(appState.rig.segmentGroups || {}).forEach((segmentGroup) => {
            segmentGroup.traverse((object) => {
                if (!object.isMesh || !object.material) {
                    return;
                }

                const materials = Array.isArray(object.material) ? object.material : [object.material];
                materials.forEach((material) => {
                    if (!material.userData.recordsOriginalStyle) {
                        material.userData.recordsOriginalStyle = {
                            opacity: typeof material.opacity === "number" ? material.opacity : 1,
                            transparent: Boolean(material.transparent),
                            depthWrite: material.depthWrite !== false
                        };
                    }

                    const original = material.userData.recordsOriginalStyle;
                    if (state.enabled) {
                        material.transparent = true;
                        material.opacity = Math.max(0.08, original.opacity * 0.15);
                        material.depthWrite = false;
                    } else {
                        material.transparent = original.transparent;
                        material.opacity = original.opacity;
                        material.depthWrite = original.depthWrite;
                    }
                });
            });
        });
    }

    function tick() {
        const appState = window.recordsAppState;
        if (appState && state.overlay && Array.isArray(appState.jointVectors)) {
            const { joints, links, pelvisHalo, pelvisCenter, labels } = state.overlay;

            // 更新脉冲动画相位
            state.pulsePhase = (state.pulsePhase + 0.02) % (Math.PI * 2);
            const pulseFactor = 0.95 + Math.sin(state.pulsePhase) * 0.05;

            // 更新关节球体位置
            Object.entries(JOINT_INDEX).forEach(([name, index]) => {
                const vector = appState.jointVectors[index];
                const node = joints[name];
                if (!vector || !node) {
                    return;
                }

                node.position.copy(vector);

                // 根据关节类型设置缩放
                const isFoot = FOOT_JOINTS.has(name);
                const isMajor = MAJOR_JOINTS.has(name) || name === "pelvis";
                let emphasis = isMajor ? 1.1 : isFoot ? 1.15 : 1.0;

                // 添加脉冲效果
                if (isMajor) {
                    emphasis *= pulseFactor;
                }

                node.scale.setScalar(emphasis);
            });

            // 更新骨骼连接线
            links.forEach((link) => {
                const from = appState.jointVectors[JOINT_INDEX[link.from]];
                const to = appState.jointVectors[JOINT_INDEX[link.to]];
                if (!from || !to) {
                    return;
                }

                link.positions[0] = from.x;
                link.positions[1] = from.y;
                link.positions[2] = from.z;
                link.positions[3] = to.x;
                link.positions[4] = to.y;
                link.positions[5] = to.z;
                link.line.geometry.attributes.position.needsUpdate = true;
                link.line.geometry.computeBoundingSphere();
            });

            // 更新骨盆光环
            const pelvis = appState.jointVectors[JOINT_INDEX.pelvis];
            if (pelvis) {
                pelvisHalo.position.set(pelvis.x, pelvis.y - 2.2, pelvis.z);
                pelvisHalo.material.opacity = state.enabled ? 0.32 * pulseFactor : 0;

                pelvisCenter.position.set(pelvis.x, pelvis.y - 2.5, pelvis.z);
                pelvisCenter.material.opacity = state.enabled ? 0.22 : 0;
            }

            // 更新标签位置（如果启用）
            if (state.showLabels && labels) {
                Object.entries(labels).forEach(([name, sprite]) => {
                    const vector = appState.jointVectors[JOINT_INDEX[name]];
                    if (vector) {
                        sprite.position.set(vector.x, vector.y + 12, vector.z);
                        sprite.visible = state.enabled;
                        sprite.material.opacity = state.enabled ? 0.9 : 0;
                    }
                });
            }
        }

        state.frameLoopId = requestAnimationFrame(tick);
    }

    // 暴露API供外部调用
    window.skeletonOverlay = {
        toggle: () => {
            state.enabled = !state.enabled;
            updatePresentationState();
        },
        toggleLabels: () => {
            state.showLabels = !state.showLabels;
        },
        isEnabled: () => state.enabled
    };

    boot();
})();
