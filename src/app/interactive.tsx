'use client'

import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { MathUtils } from 'three'

export default function InteractiveScene({ scrollY = 0 }) {
	const meshRef = useRef(1)

	// Create particles
	const particles = useMemo(() => {
		const temp = []
		for (let i = 0; i < 100; i++) {
			const x = (Math.random() - 0.5) * 10
			const y = (Math.random() - 0.5) * 10
			const z = (Math.random() - 0.5) * 10
			temp.push({ x, y, z })
		}
		return temp
	}, [])

	useFrame((state, delta) => {
		if (meshRef.current) {
			// Rotate based on scroll position
			meshRef.current.rotation.x = MathUtils.damp(
				meshRef.current.rotation.x,
				scrollY * 0.005,
				4,
				delta
			)
			meshRef.current.rotation.y += delta * 0.2
		}
	})

	return (
		<group>
			{/* Main geometric shape */}
			<mesh ref={meshRef}>
				<torusKnotGeometry args={[1.5, 0.4, 128, 32]} />
				<meshStandardMaterial
					color='#6366f1'
					roughness={0.3}
					metalness={0.8}
					emissive='#4338ca'
					emissiveIntensity={0.2}
				/>
			</mesh>

			{/* Particles */}
			{particles.map((particle, i) => (
				<mesh key={i} position={[particle.x, particle.y, particle.z]}>
					<sphereGeometry args={[0.05, 16, 16]} />
					<meshStandardMaterial
						color='#a5b4fc'
						emissive='#818cf8'
						emissiveIntensity={0.5}
					/>
				</mesh>
			))}
		</group>
	)
}
