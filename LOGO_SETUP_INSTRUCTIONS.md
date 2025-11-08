# AGROMONK Logo Setup Instructions

## How to Add Your Logo

1. **Save your AGROMONK logo image** to the following location:
   ```
   frontend/public/agromonk-logo.png
   ```
   
   **OR** if you have an SVG version:
   ```
   frontend/public/agromonk-logo.svg
   ```

2. **Supported formats:**
   - PNG (recommended)
   - SVG (scalable)
   - JPG/JPEG

3. **Recommended dimensions:**
   - Width: 200-300px
   - Height: 60-80px
   - Aspect ratio: approximately 3:1 (wide format)

4. **The logo will automatically appear in:**
   - Header (top navigation)
   - Footer (bottom of page)
   - All pages that use these components

## Current Implementation

The logo is now integrated using Next.js Image component with:
- Responsive sizing (h-8 to h-12 depending on screen size)
- Hover effects (slight scale animation)
- Optimized loading with priority flag
- Proper alt text for accessibility

## Notes

- The logo will maintain its aspect ratio automatically
- If you need to adjust the size, you can modify the `className` in the components
- The logo should have a transparent background for best results
- Make sure the logo is readable on both light and dark backgrounds
