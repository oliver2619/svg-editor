## important (22)
* flip horiz / vert: box
* scale: ellipse -> adjust rotation when sx != sy
* linear gradient
* radial gradient
* pattern
* svg import: color references url(...)
* image
	* rescale
	* fit to content
* convert to path
* convert to polygon
* convert to polyline
* edit path
	* ellipse
	* circle
	* rect
	* polygon
	* polyline
	* line
	* path
* all shapes, text, library objects: gradient / pattern, stroke gradient / pattern
* all lines, pencils: stroke gradient / pattern
* paint preview: use selected shape properties (pencil, line, rect, circle, ellipse, polygon, path)
* layer view: nested groups

## todo (9)
* show grid
* wireframe mode
* duplicate selection
* convert to clip path
* path: reduce / smooth (add) vertices
* transform pivot point
* image link
* Refactoring Tools component: law of demeter
* clipping paths: crop image, move shape with clipping path: what happens?

## Tools (6)
* insert library element -> list of objects -> mouse
* library objects can be a class that generates the shape with current parameters (e.g. random circle, random line)
* library: filter, images
* pipette: copy / paste mode
* text (font, size, weight, ...): edit, import, export
* line connect
* measure -> draw handle -> translate parallel

## other useful functions
* create noise in shape
* create hairs
...

## layers (2)
* new group, delete, rename, up, down, duplicate, merge down, (merge all)
* object properties: id, class, visible(hidden, visible, exclusive), rotation angle, gaussian blur value, x, y, width, height, border-radius, fill color, strike color, strike style, line join, line cap, opacity, vector-settings

## other (13)
* miniview (show visible part, scroll)
* shortcuts
* clip path list
* defs
* symbol / use
* patterns
* prevent tool change during drawing (mouse down)
* load / save tool settings
* save current tool
* global css layout
* timeline
* editor settings: rulers
* import apply all transformations

## maybe (9)
* line marker
* file download inline elements, omit empty optional elements (title, defs)
* text path
* file: open, save json
* image: save as png, jpeg, pdf
* align to ...
* line connectors
* copy / paste
* Edit SVG
* editor settings: background, unit (px, pt, em, ex, mm, cm, in), grid color
* auswahl invertieren (why and how?)

# Bugs (2)
* undo insert shape / redo remove group: when shape is selected causes error
* has been checked error in tools component
* box shapes: ViewService.getElementsContainingPoint and ViewService.getSelectionBoundingBox is not correct with transformations
