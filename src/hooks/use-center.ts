'use client'

import { useEffect } from 'react'
import { create } from 'zustand'

type CenterState = {
	x: number
	y: number
	centerX: number
	centerY: number
	width: number
	height: number
	scale: number
	setCenter: (x: number, y: number) => void
	recalc: () => void
}

// 中等屏（768–1279px）卡片用固定像素铺开会超出视口、互相重叠。
// 这里按视口宽度算一个全局缩放系数，让卡片等比缩小收进屏幕。
// <768px 由 max-sm 竖排布局接管，scale 保持 1（该区间卡片不按浮窗定位）。
const computeScale = (width: number): number => {
	if (width >= 1280) return 1.0
	if (width >= 1024) return 0.88
	if (width >= 768) return 0.76
	return 1.0
}

const computeCenter = () => {
	if (typeof window === 'undefined') {
		return { x: 0, y: 0, width: 0, height: 0, scale: 1 }
	}
	const width = window.innerWidth
	const height = window.innerHeight
	return {
		x: Math.floor(width / 2),
		y: Math.floor(height / 2) - 24,
		centerX: Math.floor(width / 2),
		centerY: Math.floor(height / 2),
		width,
		height,
		scale: computeScale(width)
	}
}

export const useCenterStore = create<CenterState>(set => ({
	x: 0,
	y: 0,
	centerX: 0,
	centerY: 0,
	width: 0,
	height: 0,
	scale: 1,
	setCenter: (x, y) => set({ x, y }),
	recalc: () => {
		const c = computeCenter()
		set({ x: c.x, y: c.y, width: c.width, height: c.height, centerX: c.centerX, centerY: c.centerY, scale: c.scale })
	}
}))

export function useCenterInit() {
	useEffect(() => {
		const update = () => useCenterStore.getState().recalc()
		update()
		window.addEventListener('resize', update)
		return () => window.removeEventListener('resize', update)
	}, [])
}
