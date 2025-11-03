# Design Guidelines: Collaborative Digital Whiteboard

## Design Approach

**Selected Approach**: Design System (Material Design-inspired)
**Justification**: This is a utility-focused productivity tool requiring efficiency, clarity, and performance. Drawing inspiration from professional design tools like Figma, Miro, and Excalidraw to create an intuitive, functional interface.

**Key Design Principles**:
- Clarity over decoration - every element serves a functional purpose
- Tool accessibility - frequently used features immediately visible
- Canvas-first - UI recedes to let work take center stage
- Visual feedback - clear system states and user actions

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 8, 12, 16** consistently
- Tool spacing: `gap-2` between related items, `gap-4` between groups
- Toolbar padding: `p-2` for compact controls
- Panel margins: `m-4` for breathing room
- Section gaps: `gap-8` for distinct areas

**Grid Structure**:
- Top toolbar: Fixed height `h-14`, full width with `px-4`
- Canvas area: Fills remaining viewport (flex-1)
- Floating panels: `max-w-xs` for side panels, `max-w-sm` for modals

---

## Typography

**Font Families**:
- Primary UI: Inter (Google Fonts) - clean, readable for interface elements
- Monospace: JetBrains Mono - for canvas codes and technical details

**Hierarchy**:
- Tool labels: `text-xs font-medium` (11px)
- Button text: `text-sm font-medium` (14px)
- Panel titles: `text-base font-semibold` (16px)
- Canvas codes: `text-lg font-mono tracking-wider` (18px)
- Modal headings: `text-xl font-bold` (20px)

---

## Component Library

### Top Toolbar
**Structure**: Single horizontal bar spanning full width, organized into logical groups with visual separators

**Tool Organization** (left to right):
1. Canvas selector dropdown (leftmost)
2. Drawing tools group: Pen, Eraser, Text, Shapes
3. Color controls: Stroke picker, Fill picker
4. Canvas controls: Zoom display, Zoom in/out, Reset
5. Actions: Undo/Redo
6. Utilities: Insert image, Download (rightmost)

**Tool Buttons**:
- Size: `w-10 h-10` for icon buttons
- Icon size: `w-5 h-5` within buttons
- Active state: Distinct visual indicator (e.g., border treatment)
- Tooltips: Appear on hover with `text-xs`, positioned below button

**Dropdown Menus**:
- Width: `w-56` for standard dropdowns, `w-64` for canvas menu
- Item height: `h-10` with `px-3` horizontal padding
- Grouped sections with subtle dividers (`border-t` with spacing)

### Canvas Area
**Layout**:
- Full viewport fill with overflow hidden
- No default border or background pattern (added via toggle)
- Pan cursor changes to grab/grabbing during space+drag

**Grid Background** (when enabled):
- Subtle dot pattern at 20px intervals
- Fades at extreme zoom levels (< 25% or > 200%)

### User Presence Indicators
**Cursor Labels**:
- Position: Floats above user cursor position
- Size: `px-2 py-1 text-xs rounded`
- Content: Username + active tool icon
- Maximum 3 labels visible at once, overflow shows count

**Connection Status**:
- Position: Top-right corner of canvas, `absolute top-4 right-4`
- Size: Compact pill shape `px-3 py-1.5 text-xs`
- Shows user count and connection state

### Floating Panels
**Canvas Menu Panel**:
- Position: Drops down from toolbar canvas selector
- Width: `w-80`
- Canvas cards: Grid layout `grid-cols-2 gap-3`
- Thumbnail: Aspect ratio 4:3, `rounded-lg`
- Card info: `text-xs` for metadata, `text-sm font-medium` for name

**Properties Panel** (for selected objects):
- Position: Floating right side, `right-4 top-20`
- Width: `w-64`
- Sections: Grouped by property type with `gap-4` between
- Input fields: `h-9` standard height, full width within panel

### Selection UI
**Selection Handles**:
- Corner handles: `w-3 h-3` squares
- Border: 2px solid with high contrast
- Rotation handle: Circle `w-4 h-4` on top center

**Multi-Select Box**:
- Dashed border, 1px stroke
- Slight transparency on fill

### Context Menu
**Structure**:
- Width: `w-48`
- Item height: `h-9`
- Dividers between action groups
- Icons: `w-4 h-4` preceding text
- Keyboard shortcuts: Right-aligned, `text-xs`

### Modals
**Dialog Structure**:
- Width: `max-w-md` for standard, `max-w-lg` for complex
- Padding: `p-6`
- Header: `pb-4` with `border-b`
- Footer: `pt-4` with `border-t`, buttons right-aligned with `gap-2`

**Code Entry Modal**:
- Input field: Large, centered, `text-2xl font-mono tracking-widest`
- Width: `w-full max-w-xs`
- Height: `h-14`
- Auto-focus on open

### Export Dialog
**Layout**:
- Two-column grid for options: `grid-cols-2 gap-4`
- Preview area: `aspect-video` thumbnail of export
- Format selector: Radio button group with `gap-3`
- Resolution options: Segmented control style

### Tool Options Panel (Contextual)
**Pen Tool Options**:
- Appears below pen button in toolbar
- Size slider: Full width with tick marks at preset sizes
- Opacity slider: Full width, `0-100` scale
- Type selector: Three buttons in row, `grid-cols-3 gap-1`

**Shape Tool Options**:
- Grid of shape icons: `grid-cols-4 gap-2`
- Icon buttons: `w-12 h-12`
- Selected shape: Persistent highlight

### Buttons
**Primary Actions**: 
- Height: `h-10`, padding: `px-4`
- Font: `text-sm font-medium`
- Border radius: `rounded-lg`

**Secondary Actions**:
- Same dimensions with alternative visual treatment

**Icon-Only Buttons**:
- Size: `w-10 h-10`
- Icon: `w-5 h-5` centered

### Form Inputs
**Text Fields**:
- Height: `h-10`
- Padding: `px-3`
- Border radius: `rounded-md`
- Focus state: Distinct border treatment

**Sliders**:
- Track height: `h-1.5`
- Thumb size: `w-4 h-4`
- Active area extends beyond visual track

---

## Animations

**Minimal Motion Strategy**:
- Toolbar dropdowns: 150ms ease-out slide-down
- Toast notifications: 200ms slide-in from top
- Modal overlays: 200ms fade-in for backdrop, 250ms scale-up for content
- No canvas-level animations (performance priority)
- Selection handles: Instant appearance, no fade

---

## Images

**No hero images required** - This is a tool-focused application where the canvas is the primary visual element.

**Icon Usage**:
- Tool icons: Use **Heroicons** (outline style) via CDN
- Consistent 24x24 base size, scaled to `w-5 h-5` in most contexts
- Toolbar icons should clearly communicate function at a glance

---

## Responsive Considerations

**Tablet (768px+)**:
- Toolbar remains horizontal but tools may wrap into second row
- Canvas menu shows single column grid
- Floating panels become bottom sheets

**Mobile (< 768px)**:
- Compact toolbar with overflow menu for less-used tools
- Canvas menu becomes full-screen overlay
- Properties panel becomes bottom drawer
- Touch-optimized hit targets: minimum `h-11` for all interactive elements

---

## Accessibility

- All tools accessible via keyboard shortcuts (displayed in tooltips)
- Focus indicators: Visible ring on all interactive elements
- Color contrast: Ensure WCAG AA compliance for all UI text
- Screen reader labels: Descriptive aria-labels for icon-only buttons
- Keyboard navigation: Tab order follows logical tool grouping