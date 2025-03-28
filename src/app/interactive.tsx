'use client'

import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { MathUtils, Vector3 } from 'three'

export default function PsychedelicStorm({ scrollY = 0 }) {
	const mainShapeRef = useRef()
	const rainRefs = useRef([])

	// Меньше капель (50 вместо 200), но сохраняем скорость
	const rainDrops = useMemo(() => {
		const drops = []
		for (let i = 0; i < 50; i++) {
			drops.push({
				position: new Vector3(
					(Math.random() - 0.5) * 20,
					Math.random() * 15 + 10,
					(Math.random() - 0.5) * 10
				),
				velocity: Math.random() * 0.3 + 0.2, // Увеличиваем скорость
				delay: Math.random() * 3, // Уменьшаем задержку для более быстрого старта
			})
		}
		return drops
	}, [])

	useFrame((state, delta) => {
		if (mainShapeRef.current) {
			mainShapeRef.current.rotation.x = MathUtils.damp(
				mainShapeRef.current.rotation.x,
				scrollY * 0.01,
				4,
				delta
			)
			mainShapeRef.current.rotation.y += delta * 0.3
			mainShapeRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.2

			mainShapeRef.current.scale.setScalar(
				1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
			)
		}

		rainDrops.forEach((drop, i) => {
			if (rainRefs.current[i]) {
				if (drop.position.y < -10) {
					drop.position.y = Math.random() * 15 + 10
					drop.position.x = (Math.random() - 0.5) * 20
				}

				if (state.clock.elapsedTime > drop.delay) {
					drop.position.y -= drop.velocity
					drop.position.x += Math.sin(state.clock.elapsedTime + i) * 0.02
				}

				rainRefs.current[i].position.copy(drop.position)
			}
		})
	})

	return (
		<group>
			{/* Лапша с розовой глазурью */}
			<group ref={mainShapeRef}>
				{/* Базовая форма лапши - вытянутый тор */}
				<mesh>
					<torusGeometry args={[1.5, 0.3, 16, 32]} />
					<meshPhysicalMaterial
						color='#ff99cc' // Розовая глазурь
						roughness={0.2}
						metalness={0.5}
						clearcoat={1}
						clearcoatRoughness={0.1}
						transmission={0.3}
						emissive='#ff66b3'
						emissiveIntensity={0.4}
						thickness={0.2}
						ior={1.5}
					/>
				</mesh>
				{/* Дополнительные "завитки" лапши */}
				<mesh>
					<torusKnotGeometry args={[0.8, 0.2, 64, 8, 2, 3]} />
					<meshPhysicalMaterial
						color='#ffffff' // Белая основа лапши
						roughness={1}
						metalness={0.3}
						clearcoat={0.5}
						transmission={1}
						emissive='#ff99cc'
						emissiveIntensity={0.2}
						opacity={1}
						transparent={true}
					/>
				</mesh>
			</group>

			{/* Капли дождя */}
			{rainDrops.map((drop, i) => (
				<mesh
					key={i}
					ref={el => (rainRefs.current[i] = el)}
					position={[drop.position.x, drop.position.y, drop.position.z]}
				>
					<cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />{' '}
					{/* Тоньше капли */}
					<meshStandardMaterial
						color='#ccffff'
						emissive='#00ffff'
						emissiveIntensity={1}
						transparent={true}
						opacity={0.6} // Более прозрачные для меньшей интенсивности
					/>
				</mesh>
			))}

			{/* Освещение */}
			<ambientLight intensity={0.5} color='#ff66b3' />
			<pointLight position={[10, 10, 10]} intensity={2} color='#ff99cc' />
			<pointLight position={[-10, -10, -10]} intensity={1} color='#00ffff' />
			<pointLight position={[0, 5, 0]} intensity={1.5} color='#ffffff' />
		</group>
	)
}
