'use client'
import { useEffect, useRef } from 'react'
import Hero from './Hero'

export default function Home() {
	const audioRef = useRef<HTMLAudioElement | null>(null)

	useEffect(() => {
		if (typeof window === 'undefined') return

		const AudioContextConstructor =
			window.AudioContext || (window as any).webkitAudioContext
		if (!AudioContextConstructor) {
			console.error('Ваш браузер не поддерживает Web Audio API')
			return
		}

		const audioContext = new AudioContextConstructor()

		// Создаем и настраиваем ноды для усиления звука
		const gainNode = audioContext.createGain()
		gainNode.gain.value = 10.0 // Увеличиваем общую громкость

		// Создаем компрессор для предотвращения клиппинга
		const compressor = audioContext.createDynamicsCompressor()
		compressor.threshold.setValueAtTime(-50, audioContext.currentTime)
		compressor.knee.setValueAtTime(40, audioContext.currentTime)
		compressor.ratio.setValueAtTime(12, audioContext.currentTime)
		compressor.attack.setValueAtTime(0, audioContext.currentTime)
		compressor.release.setValueAtTime(0.25, audioContext.currentTime)

		// Усиление басов
		const bassBoost = audioContext.createBiquadFilter()
		bassBoost.type = 'lowshelf'
		bassBoost.frequency.setValueAtTime(150, audioContext.currentTime)
		bassBoost.gain.setValueAtTime(40, audioContext.currentTime) // Сильный бас-буст

		// Усиление средних частот
		const midBoost = audioContext.createBiquadFilter()
		midBoost.type = 'peaking'
		midBoost.frequency.setValueAtTime(1500, audioContext.currentTime)
		midBoost.Q.setValueAtTime(1, audioContext.currentTime)
		midBoost.gain.setValueAtTime(25, audioContext.currentTime)

		// Усиление высоких частот
		const trebleBoost = audioContext.createBiquadFilter()
		trebleBoost.type = 'highshelf'
		trebleBoost.frequency.setValueAtTime(3000, audioContext.currentTime)
		trebleBoost.gain.setValueAtTime(30, audioContext.currentTime)

		const audio = new Audio('/sound.mp3')
		audio.loop = false
		audioRef.current = audio

		const audioSource = audioContext.createMediaElementSource(audio)

		// Соединяем все ноды в цепочку
		audioSource.connect(bassBoost)
		bassBoost.connect(midBoost)
		midBoost.connect(trebleBoost)
		trebleBoost.connect(compressor)
		compressor.connect(gainNode)
		gainNode.connect(audioContext.destination)

		const playSound = () => {
			if (audioContext.state === 'suspended') {
				audioContext.resume().then(() => {
					console.log('AudioContext resumed successfully')
				})
			}
			audio.currentTime = 0

			// Попытка воспроизведения с обработкой ошибок
			const playPromise = audio.play()

			if (playPromise !== undefined) {
				playPromise
					.then(_ => {
						console.log('Audio playback started successfully')
					})
					.catch(e => {
						console.error('Playback failed:', e)
						// Попробуем снова с небольшим интервалом
						setTimeout(() => {
							audio.play().catch(e => console.error('Retry failed:', e))
						}, 200)
					})
			}
		}

		const button = document.getElementById('playButton')
		if (button) {
			button.addEventListener('click', playSound)
		}

		return () => {
			if (button) {
				button.removeEventListener('click', playSound)
			}
			if (audioSource) {
				audioSource.disconnect()
			}
			if (audio) {
				audio.pause()
				audio.removeAttribute('src')
				audio.load()
			}
		}
	}, [])

	return (
		<>
			<Hero />
			<div className='flex justify-center items-center py-40'>
				<button
					className='bg-white px-10 py-5 text-black rounded-lg hover:scale-105 transition-transform'
					id='playButton'
				>
					НАЧАТЬ!
				</button>
			</div>
		</>
	)
}
