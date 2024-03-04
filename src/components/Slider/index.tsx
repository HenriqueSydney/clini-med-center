'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import { useKeenSlider } from 'keen-slider/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'

import styles from './styles.module.scss'
import 'keen-slider/keen-slider.min.css'
import Image from 'next/image'

interface SliderProps {
  images: string[]
  link?: string
}

export function Slider({ images, link }: SliderProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [loaded, setLoaded] = useState(false)
  const [opacities, setOpacities] = React.useState<number[]>([])

  const navigation = useRouter()

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: images.length,
    loop: true,
    detailsChanged(s) {
      const newOpacities = s.track.details.slides.map((slide) => slide.portion)
      setOpacities(newOpacities)
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true)
    },
  })

  return (
    <div className={styles['navigation-wrapper']}>
      <div ref={sliderRef} className={`${styles.fader}`}>
        {images.map((src, idx) => (
          <div
            key={idx}
            className={styles.fader__slide}
            style={{ opacity: opacities[idx] }}
          >
            <div className={styles.imageContainer}>
              {link && (
                <Image
                  src={src}
                  alt=""
                  fill={true}
                  style={{ borderRadius: '6px', cursor: 'pointer' }}
                  onClick={() => navigation.push(link)}
                />
              )}
              {!link && (
                <Image
                  src={src}
                  alt=""
                  fill={true}
                  style={{ borderRadius: '6px' }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      {loaded && instanceRef.current && (
        <>
          <FontAwesomeIcon
            onClick={(e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
              e.stopPropagation()
              instanceRef.current?.prev()
            }}
            icon={faChevronLeft}
            className={`${styles.arrow} ${styles['arrow--left']}`}
          />

          <FontAwesomeIcon
            onClick={(e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
              e.stopPropagation()
              instanceRef.current?.next()
            }}
            icon={faChevronRight}
            className={`${styles.arrow} ${styles['arrow--right']}`}
          />
        </>
      )}

      {loaded && instanceRef.current && (
        <div className={styles.dots}>
          {Array.from({
            length: instanceRef.current.track.details.slides.length,
          }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                instanceRef.current?.moveToIdx(idx)
              }}
              className={
                currentSlide === idx
                  ? `${styles.dot} ${styles.active}`
                  : styles.dot
              }
            ></button>
          ))}
        </div>
      )}
    </div>
  )
}
