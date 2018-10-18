# Reusable Timeline Component

This is a React component for visualizing events on a timeline. 

## Installation
Run `npm install`, and then `npm start` to view in your browser. 

## Usage

### Required Props

* data: ```json``` in the shape:

```
[
	{
		id: "number",
		start: "YYYY-MM-DD",
		end: "YYYY-MM-DD",
		name: "string"
	},
	...
]
```

* vertical: `boolean`. Event titles are hidden as tooltips. Default: `false`.


## Design Decisions

As I browsed 'timeline' search results on Dribbble, I realized that none of them quite fit my requirements, and thus I was able to hone in on the crucial requirements of the timeline component. 

Most timelines display only isolated events on the continuum, whereas I needed to show events with duration. The closest logic fit was a [package tracking timeline](https://cdn.dribbble.com/users/187214/screenshots/5288770/myh-messages_4x.png). What I like about this timeline design is the easy-to-follow representation of elapsed time. For instance, the package left on Oct 4, arrived at a shipping hub on Oct 8, where it stayed until Oct 10. 

None of the events have apparent relation, so I decided to put them in separate "lanes", order them by start date, and use a diverse swatch to visual distinguish them. At the cost of compactness, this arrangment helps me handle long event names, and creates a logical hierarchy of events.

### Defined Requirements

* Visually compact
* Display event title
* Clearly show duration of event
* Zoom in/out functionality (d3.js)
* Inline editable titles (React)
* Dragging events to edit (d3.js)


### Additional requirements I set for myself

* Easily reusable by other React developers
* Hide D3 logic behind abstraction layer
* Responsive, should look good as a main body widget, or as sidebar widget


## What I Like

## Looking Forward

## Testing

* I recently came across this [article](https://blog.kentcdodds.com/write-tests-not-too-many-mostly-integration-5e8c7fff591c) by Kent Dodds, a frontend engineer at PayPal. I wholeheartedly agree integration is the most "bang for your buck" type of testing 
* Test events fetch