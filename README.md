## important (17)
* linear gradient
* radial gradient
* pattern
* flip horiz / vert: box how is x, y transformed?
* svg import: color references url(...)
* edit path
	* ellipse
	* circle
	* rect
	* line
	* path
* all shapes, text, library objects: gradient / pattern, stroke gradient / pattern
* all lines, pencils: stroke gradient / pattern
* scale: ellipse -> adjust rotation when sx != sy
* image
	* rescale
	* fit to content
* layer view: nested groups
* effects

## Tools (6)
* insert library element -> list of objects -> mouse
* library objects can be a class that generates the shape with current parameters (e.g. random circle, random line)
* library: filter, images
* pipette: copy / paste mode
* text (font, size, weight, ...): edit, import, export
* line connect
* measure -> draw handle -> translate parallel

## todo (8)
* show grid
* wireframe mode
* duplicate selection
* convert to clip path
* path: reduce / smooth (add) vertices
* transform pivot point
* image link
* clipping paths: crop image, move shape with clipping path: what happens?

## layers (2)
* new group, delete, rename, up, down, duplicate, merge down, (merge all)
* object properties: id, class, visible(hidden, visible, exclusive), rotation angle, effects (gaussian blur value), x, y, width, height

# Bugs (2)
* undo insert shape / redo remove group: when shape is selected causes error
* box shapes: ViewService.getElementsContainingPoint and ViewService.getSelectionBoundingBox is not correct with transformations
* selectedShapePropertiesComponent: LineCap/join initially not updated correctly
* nested dialogs are not modal (select color at color stop)

## other useful functions
* create noise in shape
* create hairs
...

## other (15)
* some form layout: inline instead of row
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
* crop: draw handles and adjust

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