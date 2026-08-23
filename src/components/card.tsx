'use client'

import { ANIMATION_DELAY } from '@/consts'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { useSize } from '@/hooks/use-size'
import { useCenterStore } from '@/hooks/use-center'

interface Props {
	className?: string
	order: number
	width: number
	height?: number
	x: number
	y: number
	children: React.ReactNode
}

export default function Card({ children, order, width, height, x, y, className }: Props) {
	const { maxSM, init } = useSize()
	const scale = useCenterStore(state => state.scale)
	const centerX = useCenterStore(state => state.centerX)
	const centerY = useCenterStore(state => state.centerY)
	let [show, setShow] = useState(false)
	if (maxSM && init) order = 0

	// 中等屏等比缩放：以屏幕中心为锚点收拢，避免固定像素卡片溢出/重叠
	const sx = Math.round(centerX + (x - centerX) * scale)
	const sy = Math.round(centerY + (y - centerY) * scale)
	const sw = Math.round((width ?? 0) * scale)
	const sh = height !== undefined ? Math.round(height * scale) : undefined

	useEffect(() => {
		if (show) return
		if (x === 0 && y === 0) return
		setTimeout(
			() => {
				setShow(true)
			},
			order * ANIMATION_DELAY * 1000
		)
	}, [x, y, show])

	if (show)
		return (
			<motion.div
				className={cn('card squircle', className)}
				initial={{ opacity: 0, scale: 0.6 * scale, left: sx, top: sy, width: sw, height: sh }}
				animate={{ opacity: 1, scale: 1 * scale, left: sx, top: sy, width: sw, height: sh }}
				whileHover={{ scale: 1.05 * scale }}
				whileTap={{ scale: 0.95 * scale }}>
				{children}
			</motion.div>
		)

	return null
}
