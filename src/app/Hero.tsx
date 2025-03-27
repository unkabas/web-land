'use client'

import InteractiveScene from './interactive'
// import ThemeSwitcher from '@/components/theme-switcher'
// import { Button } from '@/components/ui/button'
import { Environment, Float, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Hero() {
	const [scrollY, setScrollY] = useState(0)

	useEffect(() => {
		const handleScroll = () => {
			setScrollY(window.scrollY)
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	return (
		<section className='relative h-screen w-full overflow-hidden'>
			{/* 3D Background */}
			<div className='absolute inset-0 z-0'>
				<Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
					<ambientLight intensity={0.5} />
					<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
					<Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
						<InteractiveScene scrollY={scrollY} />
					</Float>
					<Environment preset='city' />
					<OrbitControls
						enableZoom={false}
						enablePan={false}
						autoRotate
						autoRotateSpeed={0.5}
						maxPolarAngle={Math.PI / 2}
						minPolarAngle={Math.PI / 2}
					/>
				</Canvas>
			</div>

			{/* Theme Switcher */}
			<div className='absolute top-6 right-6 z-50'>
				{/* <ThemeSwitcher /> */}
			</div>

			{/* Hero Content */}
			<div className='relative z-10 flex h-full flex-col items-center justify-center px-4 text-center'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className='max-w-4xl'
				>
					<h1 className='mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl'>
						We Create <span className='text-primary'>Digital Experiences</span>{' '}
						That Matter
					</h1>
					<p className='mb-8 text-lg text-muted-foreground md:text-xl'>
						Crafting high-performance websites and applications with
						cutting-edge technology and stunning design
					</p>
					<div className='flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center'>
						<button className='group'>
							View Our Work
							<ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
						</button>
						<button>Get in Touch</button>
					</div>
				</motion.div>
			</div>

			{/* Scroll Indicator */}
			<motion.div
				className='absolute bottom-8 left-1/2 z-10 -translate-x-1/2'
				animate={{
					y: [0, 10, 0],
				}}
				transition={{
					repeat: Number.POSITIVE_INFINITY,
					duration: 1.5,
				}}
			>
				<div className='h-14 w-8 rounded-full border-2 border-primary flex justify-center'>
					<motion.div
						className='h-3 w-3 rounded-full bg-primary mt-2'
						animate={{
							opacity: [0.2, 1, 0.2],
							y: [0, 6, 0],
						}}
						transition={{
							repeat: Number.POSITIVE_INFINITY,
							duration: 1.5,
						}}
					/>
				</div>
			</motion.div>
		</section>
	)
}
