'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
}

export function Carousel({ 
  children, 
  className, 
  autoPlay = false, 
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true 
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const childrenArray = React.Children.toArray(children);
  const totalSlides = childrenArray.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (autoPlay && totalSlides > 1) {
      const interval = setInterval(nextSlide, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, totalSlides]);

  if (totalSlides === 0) return null;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Slides */}
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {childrenArray.map((child, index) => (
          <div key={index} className="w-full flex-shrink-0">
            {child}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && totalSlides > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {childrenArray.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                index === currentIndex 
                  ? "bg-white scale-125" 
                  : "bg-white/50 hover:bg-white/75"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Hero Carousel Component
interface HeroCarouselProps {
  slides: Array<{
    id: string;
    title: string;
    subtitle: string;
    image: string;
    ctaText?: string;
    ctaHref?: string;
  }>;
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  return (
    <Carousel className="h-[500px] lg:h-[600px]">
      {slides.map((slide) => (
        <div key={slide.id} className="relative h-full">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-green-700/90"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          ></div>
          <div className="relative h-full flex items-center">
            <div className="container text-white">
              <div className="max-w-2xl">
                <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-xl lg:text-2xl mb-8 text-green-100">
                  {slide.subtitle}
                </p>
                {slide.ctaText && (
                  <a
                    href={slide.ctaHref || '#'}
                    className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-2xl font-semibold hover:bg-gray-100 transition-colors shadow-large hover:shadow-glow"
                  >
                    {slide.ctaText}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
}
