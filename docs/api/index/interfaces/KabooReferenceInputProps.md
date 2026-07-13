[**@pgege/kaboo-react**](../../README.md)

***

# Interface: KabooReferenceInputProps

Defined in: src/references/ReferenceInput.tsx:31

Props for [KabooReferenceInput](../functions/KabooReferenceInput.md). This is a drop-in value for
`<CopilotChat input={…}>`, so it receives every prop CopilotKit hands the
input slot (value, onChange, onSubmitMessage, …) plus a couple of
kaboo-specific knobs.

## Extends

- `CopilotInputProps`

## Properties

### about?

> `optional` **about?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2820

#### Inherited from

`CopilotInputProps.about`

***

### accessKey?

> `optional` **accessKey?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2793

#### Inherited from

`CopilotInputProps.accessKey`

***

### addMenuButton?

> `optional` **addMenuButton?**: `SlotValue`\<`FC`\<`ButtonHTMLAttributes`\<`HTMLButtonElement`\> & `object`\>\>

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:652

#### Inherited from

`CopilotInputProps.addMenuButton`

***

### aria-activedescendant?

> `optional` **aria-activedescendant?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2491

Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application.

#### Inherited from

`CopilotInputProps.aria-activedescendant`

***

### aria-atomic?

> `optional` **aria-atomic?**: `Booleanish`

Defined in: node\_modules/@types/react/index.d.ts:2493

Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute.

#### Inherited from

`CopilotInputProps.aria-atomic`

***

### aria-autocomplete?

> `optional` **aria-autocomplete?**: `"none"` \| `"inline"` \| `"list"` \| `"both"`

Defined in: node\_modules/@types/react/index.d.ts:2498

Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
presented if they are made.

#### Inherited from

`CopilotInputProps.aria-autocomplete`

***

### aria-braillelabel?

> `optional` **aria-braillelabel?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2504

Defines a string value that labels the current element, which is intended to be converted into Braille.

#### See

aria-label.

#### Inherited from

`CopilotInputProps.aria-braillelabel`

***

### aria-brailleroledescription?

> `optional` **aria-brailleroledescription?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2509

Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille.

#### See

aria-roledescription.

#### Inherited from

`CopilotInputProps.aria-brailleroledescription`

***

### aria-busy?

> `optional` **aria-busy?**: `Booleanish`

Defined in: node\_modules/@types/react/index.d.ts:2510

#### Inherited from

`CopilotInputProps.aria-busy`

***

### aria-checked?

> `optional` **aria-checked?**: `boolean` \| `"true"` \| `"false"` \| `"mixed"`

Defined in: node\_modules/@types/react/index.d.ts:2515

Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.

#### See

 - aria-pressed
 - aria-selected.

#### Inherited from

`CopilotInputProps.aria-checked`

***

### aria-colcount?

> `optional` **aria-colcount?**: `number`

Defined in: node\_modules/@types/react/index.d.ts:2520

Defines the total number of columns in a table, grid, or treegrid.

#### See

aria-colindex.

#### Inherited from

`CopilotInputProps.aria-colcount`

***

### aria-colindex?

> `optional` **aria-colindex?**: `number`

Defined in: node\_modules/@types/react/index.d.ts:2525

Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.

#### See

 - aria-colcount
 - aria-colspan.

#### Inherited from

`CopilotInputProps.aria-colindex`

***

### aria-colindextext?

> `optional` **aria-colindextext?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2530

Defines a human readable text alternative of aria-colindex.

#### See

aria-rowindextext.

#### Inherited from

`CopilotInputProps.aria-colindextext`

***

### aria-colspan?

> `optional` **aria-colspan?**: `number`

Defined in: node\_modules/@types/react/index.d.ts:2535

Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.

#### See

 - aria-colindex
 - aria-rowspan.

#### Inherited from

`CopilotInputProps.aria-colspan`

***

### aria-controls?

> `optional` **aria-controls?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2540

Identifies the element (or elements) whose contents or presence are controlled by the current element.

#### See

aria-owns.

#### Inherited from

`CopilotInputProps.aria-controls`

***

### aria-current?

> `optional` **aria-current?**: `boolean` \| `"step"` \| `"date"` \| `"time"` \| `"true"` \| `"false"` \| `"page"` \| `"location"`

Defined in: node\_modules/@types/react/index.d.ts:2542

Indicates the element that represents the current item within a container or set of related elements.

#### Inherited from

`CopilotInputProps.aria-current`

***

### aria-describedby?

> `optional` **aria-describedby?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2547

Identifies the element (or elements) that describes the object.

#### See

aria-labelledby

#### Inherited from

`CopilotInputProps.aria-describedby`

***

### aria-description?

> `optional` **aria-description?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2552

Defines a string value that describes or annotates the current element.

#### See

related aria-describedby.

#### Inherited from

`CopilotInputProps.aria-description`

***

### aria-details?

> `optional` **aria-details?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2557

Identifies the element that provides a detailed, extended description for the object.

#### See

aria-describedby.

#### Inherited from

`CopilotInputProps.aria-details`

***

### aria-disabled?

> `optional` **aria-disabled?**: `Booleanish`

Defined in: node\_modules/@types/react/index.d.ts:2562

Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.

#### See

 - aria-hidden
 - aria-readonly.

#### Inherited from

`CopilotInputProps.aria-disabled`

***

### ~~aria-dropeffect?~~

> `optional` **aria-dropeffect?**: `"link"` \| `"none"` \| `"copy"` \| `"execute"` \| `"move"` \| `"popup"`

Defined in: node\_modules/@types/react/index.d.ts:2567

Indicates what functions can be performed when a dragged object is released on the drop target.

#### Deprecated

in ARIA 1.1

#### Inherited from

`CopilotInputProps.aria-dropeffect`

***

### aria-errormessage?

> `optional` **aria-errormessage?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2572

Identifies the element that provides an error message for the object.

#### See

 - aria-invalid
 - aria-describedby.

#### Inherited from

`CopilotInputProps.aria-errormessage`

***

### aria-expanded?

> `optional` **aria-expanded?**: `Booleanish`

Defined in: node\_modules/@types/react/index.d.ts:2574

Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed.

#### Inherited from

`CopilotInputProps.aria-expanded`

***

### aria-flowto?

> `optional` **aria-flowto?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2579

Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
allows assistive technology to override the general default of reading in document source order.

#### Inherited from

`CopilotInputProps.aria-flowto`

***

### ~~aria-grabbed?~~

> `optional` **aria-grabbed?**: `Booleanish`

Defined in: node\_modules/@types/react/index.d.ts:2584

Indicates an element's "grabbed" state in a drag-and-drop operation.

#### Deprecated

in ARIA 1.1

#### Inherited from

`CopilotInputProps.aria-grabbed`

***

### aria-haspopup?

> `optional` **aria-haspopup?**: `boolean` \| `"true"` \| `"false"` \| `"dialog"` \| `"menu"` \| `"grid"` \| `"listbox"` \| `"tree"`

Defined in: node\_modules/@types/react/index.d.ts:2586

Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element.

#### Inherited from

`CopilotInputProps.aria-haspopup`

***

### aria-hidden?

> `optional` **aria-hidden?**: `Booleanish`

Defined in: node\_modules/@types/react/index.d.ts:2591

Indicates whether the element is exposed to an accessibility API.

#### See

aria-disabled.

#### Inherited from

`CopilotInputProps.aria-hidden`

***

### aria-invalid?

> `optional` **aria-invalid?**: `boolean` \| `"true"` \| `"false"` \| `"grammar"` \| `"spelling"`

Defined in: node\_modules/@types/react/index.d.ts:2596

Indicates the entered value does not conform to the format expected by the application.

#### See

aria-errormessage.

#### Inherited from

`CopilotInputProps.aria-invalid`

***

### aria-keyshortcuts?

> `optional` **aria-keyshortcuts?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2598

Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element.

#### Inherited from

`CopilotInputProps.aria-keyshortcuts`

***

### aria-label?

> `optional` **aria-label?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2603

Defines a string value that labels the current element.

#### See

aria-labelledby.

#### Inherited from

`CopilotInputProps.aria-label`

***

### aria-labelledby?

> `optional` **aria-labelledby?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2608

Identifies the element (or elements) that labels the current element.

#### See

aria-describedby.

#### Inherited from

`CopilotInputProps.aria-labelledby`

***

### aria-level?

> `optional` **aria-level?**: `number`

Defined in: node\_modules/@types/react/index.d.ts:2610

Defines the hierarchical level of an element within a structure.

#### Inherited from

`CopilotInputProps.aria-level`

***

### aria-live?

> `optional` **aria-live?**: `"off"` \| `"assertive"` \| `"polite"`

Defined in: node\_modules/@types/react/index.d.ts:2612

Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region.

#### Inherited from

`CopilotInputProps.aria-live`

***

### aria-modal?

> `optional` **aria-modal?**: `Booleanish`

Defined in: node\_modules/@types/react/index.d.ts:2614

Indicates whether an element is modal when displayed.

#### Inherited from

`CopilotInputProps.aria-modal`

***

### aria-multiline?

> `optional` **aria-multiline?**: `Booleanish`

Defined in: node\_modules/@types/react/index.d.ts:2616

Indicates whether a text box accepts multiple lines of input or only a single line.

#### Inherited from

`CopilotInputProps.aria-multiline`

***

### aria-multiselectable?

> `optional` **aria-multiselectable?**: `Booleanish`

Defined in: node\_modules/@types/react/index.d.ts:2618

Indicates that the user may select more than one item from the current selectable descendants.

#### Inherited from

`CopilotInputProps.aria-multiselectable`

***

### aria-orientation?

> `optional` **aria-orientation?**: `"horizontal"` \| `"vertical"`

Defined in: node\_modules/@types/react/index.d.ts:2620

Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous.

#### Inherited from

`CopilotInputProps.aria-orientation`

***

### aria-owns?

> `optional` **aria-owns?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2626

Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
between DOM elements where the DOM hierarchy cannot be used to represent the relationship.

#### See

aria-controls.

#### Inherited from

`CopilotInputProps.aria-owns`

***

### aria-placeholder?

> `optional` **aria-placeholder?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2631

Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
A hint could be a sample value or a brief description of the expected format.

#### Inherited from

`CopilotInputProps.aria-placeholder`

***

### aria-posinset?

> `optional` **aria-posinset?**: `number`

Defined in: node\_modules/@types/react/index.d.ts:2636

Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.

#### See

aria-setsize.

#### Inherited from

`CopilotInputProps.aria-posinset`

***

### aria-pressed?

> `optional` **aria-pressed?**: `boolean` \| `"true"` \| `"false"` \| `"mixed"`

Defined in: node\_modules/@types/react/index.d.ts:2641

Indicates the current "pressed" state of toggle buttons.

#### See

 - aria-checked
 - aria-selected.

#### Inherited from

`CopilotInputProps.aria-pressed`

***

### aria-readonly?

> `optional` **aria-readonly?**: `Booleanish`

Defined in: node\_modules/@types/react/index.d.ts:2646

Indicates that the element is not editable, but is otherwise operable.

#### See

aria-disabled.

#### Inherited from

`CopilotInputProps.aria-readonly`

***

### aria-relevant?

> `optional` **aria-relevant?**: `"text"` \| `"additions"` \| `"additions removals"` \| `"additions text"` \| `"all"` \| `"removals"` \| `"removals additions"` \| `"removals text"` \| `"text additions"` \| `"text removals"`

Defined in: node\_modules/@types/react/index.d.ts:2651

Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.

#### See

aria-atomic.

#### Inherited from

`CopilotInputProps.aria-relevant`

***

### aria-required?

> `optional` **aria-required?**: `Booleanish`

Defined in: node\_modules/@types/react/index.d.ts:2664

Indicates that user input is required on the element before a form may be submitted.

#### Inherited from

`CopilotInputProps.aria-required`

***

### aria-roledescription?

> `optional` **aria-roledescription?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2666

Defines a human-readable, author-localized description for the role of an element.

#### Inherited from

`CopilotInputProps.aria-roledescription`

***

### aria-rowcount?

> `optional` **aria-rowcount?**: `number`

Defined in: node\_modules/@types/react/index.d.ts:2671

Defines the total number of rows in a table, grid, or treegrid.

#### See

aria-rowindex.

#### Inherited from

`CopilotInputProps.aria-rowcount`

***

### aria-rowindex?

> `optional` **aria-rowindex?**: `number`

Defined in: node\_modules/@types/react/index.d.ts:2676

Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.

#### See

 - aria-rowcount
 - aria-rowspan.

#### Inherited from

`CopilotInputProps.aria-rowindex`

***

### aria-rowindextext?

> `optional` **aria-rowindextext?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2681

Defines a human readable text alternative of aria-rowindex.

#### See

aria-colindextext.

#### Inherited from

`CopilotInputProps.aria-rowindextext`

***

### aria-rowspan?

> `optional` **aria-rowspan?**: `number`

Defined in: node\_modules/@types/react/index.d.ts:2686

Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.

#### See

 - aria-rowindex
 - aria-colspan.

#### Inherited from

`CopilotInputProps.aria-rowspan`

***

### aria-selected?

> `optional` **aria-selected?**: `Booleanish`

Defined in: node\_modules/@types/react/index.d.ts:2691

Indicates the current "selected" state of various widgets.

#### See

 - aria-checked
 - aria-pressed.

#### Inherited from

`CopilotInputProps.aria-selected`

***

### aria-setsize?

> `optional` **aria-setsize?**: `number`

Defined in: node\_modules/@types/react/index.d.ts:2696

Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.

#### See

aria-posinset.

#### Inherited from

`CopilotInputProps.aria-setsize`

***

### aria-sort?

> `optional` **aria-sort?**: `"none"` \| `"other"` \| `"ascending"` \| `"descending"`

Defined in: node\_modules/@types/react/index.d.ts:2698

Indicates if items in a table or grid are sorted in ascending or descending order.

#### Inherited from

`CopilotInputProps.aria-sort`

***

### aria-valuemax?

> `optional` **aria-valuemax?**: `number`

Defined in: node\_modules/@types/react/index.d.ts:2700

Defines the maximum allowed value for a range widget.

#### Inherited from

`CopilotInputProps.aria-valuemax`

***

### aria-valuemin?

> `optional` **aria-valuemin?**: `number`

Defined in: node\_modules/@types/react/index.d.ts:2702

Defines the minimum allowed value for a range widget.

#### Inherited from

`CopilotInputProps.aria-valuemin`

***

### aria-valuenow?

> `optional` **aria-valuenow?**: `number`

Defined in: node\_modules/@types/react/index.d.ts:2707

Defines the current value for a range widget.

#### See

aria-valuetext.

#### Inherited from

`CopilotInputProps.aria-valuenow`

***

### aria-valuetext?

> `optional` **aria-valuetext?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2709

Defines the human readable text alternative of aria-valuenow for a range widget.

#### Inherited from

`CopilotInputProps.aria-valuetext`

***

### audioRecorder?

> `optional` **audioRecorder?**: `SlotValue`\<`ForwardRefExoticComponent`\<`HTMLAttributes`\<`HTMLDivElement`\> & `RefAttributes`\<`AudioRecorderRef`\>\>\>

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:653

#### Inherited from

`CopilotInputProps.audioRecorder`

***

### autoCapitalize?

> `optional` **autoCapitalize?**: `string` & `object` \| `"none"` \| `"off"` \| `"on"` \| `"sentences"` \| `"words"` \| `"characters"`

Defined in: node\_modules/@types/react/index.d.ts:2794

#### Inherited from

`CopilotInputProps.autoCapitalize`

***

### autoCorrect?

> `optional` **autoCorrect?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2833

#### Inherited from

`CopilotInputProps.autoCorrect`

***

### autoFocus?

> `optional` **autoFocus?**: `boolean`

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:659

#### Inherited from

`CopilotInputProps.autoFocus`

***

### autoSave?

> `optional` **autoSave?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2834

#### Inherited from

`CopilotInputProps.autoSave`

***

### bottomAnchored?

> `optional` **bottomAnchored?**: `boolean`

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:686

Set to `true` when the input sits at the bottom of its container as a
flex-last-child (visible position is driven by layout, not CSS
positioning). Triggers reservation of bottom space for the fixed
CopilotKit license banner via the
`--copilotkit-license-banner-offset` CSS var so the two don't overlap.

Not needed when `positioning === "absolute"`; that mode already pins the
input to the bottom and picks up the same reservation automatically.
Leave unset (default `false`) for inputs rendered mid-layout such as the
welcome screen, where the banner offset would push the input off-center.

#### Inherited from

`CopilotInputProps.bottomAnchored`

***

### cancelTranscribeButton?

> `optional` **cancelTranscribeButton?**: `SlotValue`\<`FC`\<`ButtonHTMLAttributes`\<`HTMLButtonElement`\>\>\>

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:650

#### Inherited from

`CopilotInputProps.cancelTranscribeButton`

***

### children?

> `optional` **children?**: (`props`) => `ReactNode`

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:693

#### Parameters

##### props

`SlotElements`\<`CopilotChatInputSlots`\> & `object` & `Omit`\<`HTMLAttributes`\<`HTMLDivElement`\>, `"onChange"`\>

#### Returns

`ReactNode`

#### Inherited from

`CopilotInputProps.children`

***

### className?

> `optional` **className?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2796

#### Inherited from

`CopilotInputProps.className`

***

### color?

> `optional` **color?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2835

#### Inherited from

`CopilotInputProps.color`

***

### containerRef?

> `optional` **containerRef?**: `Ref`\<`HTMLDivElement`\>

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:672

#### Inherited from

`CopilotInputProps.containerRef`

***

### content?

> `optional` **content?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2821

#### Inherited from

`CopilotInputProps.content`

***

### contentEditable?

> `optional` **contentEditable?**: `"inherit"` \| `Booleanish` \| `"plaintext-only"`

Defined in: node\_modules/@types/react/index.d.ts:2797

#### Inherited from

`CopilotInputProps.contentEditable`

***

### contextMenu?

> `optional` **contextMenu?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2798

#### Inherited from

`CopilotInputProps.contextMenu`

***

### dangerouslySetInnerHTML?

> `optional` **dangerouslySetInnerHTML?**: `object`

Defined in: node\_modules/@types/react/index.d.ts:2268

#### \_\_html

> **\_\_html**: `string` \| `TrustedHTML`

#### Inherited from

`CopilotInputProps.dangerouslySetInnerHTML`

***

### datatype?

> `optional` **datatype?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2822

#### Inherited from

`CopilotInputProps.datatype`

***

### defaultChecked?

> `optional` **defaultChecked?**: `boolean`

Defined in: node\_modules/@types/react/index.d.ts:2787

#### Inherited from

`CopilotInputProps.defaultChecked`

***

### defaultValue?

> `optional` **defaultValue?**: `string` \| `number` \| readonly `string`[]

Defined in: node\_modules/@types/react/index.d.ts:2788

#### Inherited from

`CopilotInputProps.defaultValue`

***

### dir?

> `optional` **dir?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2799

#### Inherited from

`CopilotInputProps.dir`

***

### disclaimer?

> `optional` **disclaimer?**: `SlotValue`\<`FC`\<`HTMLAttributes`\<`HTMLDivElement`\>\>\>

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:654

#### Inherited from

`CopilotInputProps.disclaimer`

***

### draggable?

> `optional` **draggable?**: `Booleanish`

Defined in: node\_modules/@types/react/index.d.ts:2800

#### Inherited from

`CopilotInputProps.draggable`

***

### enterKeyHint?

> `optional` **enterKeyHint?**: `"done"` \| `"search"` \| `"enter"` \| `"go"` \| `"next"` \| `"previous"` \| `"send"`

Defined in: node\_modules/@types/react/index.d.ts:2801

#### Inherited from

`CopilotInputProps.enterKeyHint`

***

### exportparts?

> `optional` **exportparts?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2868

#### See

[https://developer.mozilla.org/en-US/docs/Web/HTML/Global\_attributes/exportparts](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/exportparts)

#### Inherited from

`CopilotInputProps.exportparts`

***

### finishTranscribeButton?

> `optional` **finishTranscribeButton?**: `SlotValue`\<`FC`\<`ButtonHTMLAttributes`\<`HTMLButtonElement`\>\>\>

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:651

#### Inherited from

`CopilotInputProps.finishTranscribeButton`

***

### hidden?

> `optional` **hidden?**: `boolean`

Defined in: node\_modules/@types/react/index.d.ts:2802

#### Inherited from

`CopilotInputProps.hidden`

***

### id?

> `optional` **id?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2803

#### Inherited from

`CopilotInputProps.id`

***

### inert?

> `optional` **inert?**: `boolean`

Defined in: node\_modules/@types/react/index.d.ts:2854

#### See

[https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert)

#### Inherited from

`CopilotInputProps.inert`

***

### inlist?

> `optional` **inlist?**: `any`

Defined in: node\_modules/@types/react/index.d.ts:2823

#### Inherited from

`CopilotInputProps.inlist`

***

### inputMode?

> `optional` **inputMode?**: `"text"` \| `"search"` \| `"url"` \| `"none"` \| `"email"` \| `"tel"` \| `"numeric"` \| `"decimal"`

Defined in: node\_modules/@types/react/index.d.ts:2859

Hints at the type of data that might be entered by the user while editing the element or its contents

#### See

[https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute](https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute)

#### Inherited from

`CopilotInputProps.inputMode`

***

### is?

> `optional` **is?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2864

Specify that a standard HTML element should behave like a defined custom built-in element

#### See

[https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is](https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is)

#### Inherited from

`CopilotInputProps.is`

***

### isRunning?

> `optional` **isRunning?**: `boolean`

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:662

#### Inherited from

`CopilotInputProps.isRunning`

***

### itemID?

> `optional` **itemID?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2839

#### Inherited from

`CopilotInputProps.itemID`

***

### itemProp?

> `optional` **itemProp?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2836

#### Inherited from

`CopilotInputProps.itemProp`

***

### itemRef?

> `optional` **itemRef?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2840

#### Inherited from

`CopilotInputProps.itemRef`

***

### itemScope?

> `optional` **itemScope?**: `boolean`

Defined in: node\_modules/@types/react/index.d.ts:2837

#### Inherited from

`CopilotInputProps.itemScope`

***

### itemType?

> `optional` **itemType?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2838

#### Inherited from

`CopilotInputProps.itemType`

***

### keyboardHeight?

> `optional` **keyboardHeight?**: `number`

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:671

#### Inherited from

`CopilotInputProps.keyboardHeight`

***

### lang?

> `optional` **lang?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2804

#### Inherited from

`CopilotInputProps.lang`

***

### mode?

> `optional` **mode?**: `CopilotChatInputMode`

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:657

#### Inherited from

`CopilotInputProps.mode`

***

### nonce?

> `optional` **nonce?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2805

#### Inherited from

`CopilotInputProps.nonce`

***

### onAbort?

> `optional` **onAbort?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2327

#### Inherited from

`CopilotInputProps.onAbort`

***

### onAbortCapture?

> `optional` **onAbortCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2328

#### Inherited from

`CopilotInputProps.onAbortCapture`

***

### onAddFile?

> `optional` **onAddFile?**: () => `void`

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:667

#### Returns

`void`

#### Inherited from

`CopilotInputProps.onAddFile`

***

### onAnimationEnd?

> `optional` **onAnimationEnd?**: `AnimationEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2457

#### Inherited from

`CopilotInputProps.onAnimationEnd`

***

### onAnimationEndCapture?

> `optional` **onAnimationEndCapture?**: `AnimationEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2458

#### Inherited from

`CopilotInputProps.onAnimationEndCapture`

***

### onAnimationIteration?

> `optional` **onAnimationIteration?**: `AnimationEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2459

#### Inherited from

`CopilotInputProps.onAnimationIteration`

***

### onAnimationIterationCapture?

> `optional` **onAnimationIterationCapture?**: `AnimationEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2460

#### Inherited from

`CopilotInputProps.onAnimationIterationCapture`

***

### onAnimationStart?

> `optional` **onAnimationStart?**: `AnimationEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2455

#### Inherited from

`CopilotInputProps.onAnimationStart`

***

### onAnimationStartCapture?

> `optional` **onAnimationStartCapture?**: `AnimationEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2456

#### Inherited from

`CopilotInputProps.onAnimationStartCapture`

***

### onAuxClick?

> `optional` **onAuxClick?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2373

#### Inherited from

`CopilotInputProps.onAuxClick`

***

### onAuxClickCapture?

> `optional` **onAuxClickCapture?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2374

#### Inherited from

`CopilotInputProps.onAuxClickCapture`

***

### onBeforeInput?

> `optional` **onBeforeInput?**: `InputEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2299

#### Inherited from

`CopilotInputProps.onBeforeInput`

***

### onBeforeInputCapture?

> `optional` **onBeforeInputCapture?**: `InputEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2300

#### Inherited from

`CopilotInputProps.onBeforeInputCapture`

***

### onBeforeToggle?

> `optional` **onBeforeToggle?**: `ToggleEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2464

#### Inherited from

`CopilotInputProps.onBeforeToggle`

***

### onBlur?

> `optional` **onBlur?**: `FocusEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2293

#### Inherited from

`CopilotInputProps.onBlur`

***

### onBlurCapture?

> `optional` **onBlurCapture?**: `FocusEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2294

#### Inherited from

`CopilotInputProps.onBlurCapture`

***

### onCancelTranscribe?

> `optional` **onCancelTranscribe?**: () => `void`

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:664

#### Returns

`void`

#### Inherited from

`CopilotInputProps.onCancelTranscribe`

***

### onCanPlay?

> `optional` **onCanPlay?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2329

#### Inherited from

`CopilotInputProps.onCanPlay`

***

### onCanPlayCapture?

> `optional` **onCanPlayCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2330

#### Inherited from

`CopilotInputProps.onCanPlayCapture`

***

### onCanPlayThrough?

> `optional` **onCanPlayThrough?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2331

#### Inherited from

`CopilotInputProps.onCanPlayThrough`

***

### onCanPlayThroughCapture?

> `optional` **onCanPlayThroughCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2332

#### Inherited from

`CopilotInputProps.onCanPlayThroughCapture`

***

### onChange?

> `optional` **onChange?**: (`value`) => `void`

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:669

#### Parameters

##### value

`string`

#### Returns

`void`

#### Inherited from

`CopilotInputProps.onChange`

***

### onChangeCapture?

> `optional` **onChangeCapture?**: `ChangeEventHandler`\<`HTMLDivElement`, `Element`\>

Defined in: node\_modules/@types/react/index.d.ts:2298

#### Inherited from

`CopilotInputProps.onChangeCapture`

***

### onClick?

> `optional` **onClick?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2375

#### Inherited from

`CopilotInputProps.onClick`

***

### onClickCapture?

> `optional` **onClickCapture?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2376

#### Inherited from

`CopilotInputProps.onClickCapture`

***

### onCompositionEnd?

> `optional` **onCompositionEnd?**: `CompositionEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2283

#### Inherited from

`CopilotInputProps.onCompositionEnd`

***

### onCompositionEndCapture?

> `optional` **onCompositionEndCapture?**: `CompositionEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2284

#### Inherited from

`CopilotInputProps.onCompositionEndCapture`

***

### onCompositionStart?

> `optional` **onCompositionStart?**: `CompositionEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2285

#### Inherited from

`CopilotInputProps.onCompositionStart`

***

### onCompositionStartCapture?

> `optional` **onCompositionStartCapture?**: `CompositionEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2286

#### Inherited from

`CopilotInputProps.onCompositionStartCapture`

***

### onCompositionUpdate?

> `optional` **onCompositionUpdate?**: `CompositionEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2287

#### Inherited from

`CopilotInputProps.onCompositionUpdate`

***

### onCompositionUpdateCapture?

> `optional` **onCompositionUpdateCapture?**: `CompositionEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2288

#### Inherited from

`CopilotInputProps.onCompositionUpdateCapture`

***

### onContextMenu?

> `optional` **onContextMenu?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2377

#### Inherited from

`CopilotInputProps.onContextMenu`

***

### onContextMenuCapture?

> `optional` **onContextMenuCapture?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2378

#### Inherited from

`CopilotInputProps.onContextMenuCapture`

***

### onCopy?

> `optional` **onCopy?**: `ClipboardEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2275

#### Inherited from

`CopilotInputProps.onCopy`

***

### onCopyCapture?

> `optional` **onCopyCapture?**: `ClipboardEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2276

#### Inherited from

`CopilotInputProps.onCopyCapture`

***

### onCut?

> `optional` **onCut?**: `ClipboardEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2277

#### Inherited from

`CopilotInputProps.onCut`

***

### onCutCapture?

> `optional` **onCutCapture?**: `ClipboardEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2278

#### Inherited from

`CopilotInputProps.onCutCapture`

***

### onDoubleClick?

> `optional` **onDoubleClick?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2379

#### Inherited from

`CopilotInputProps.onDoubleClick`

***

### onDoubleClickCapture?

> `optional` **onDoubleClickCapture?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2380

#### Inherited from

`CopilotInputProps.onDoubleClickCapture`

***

### onDrag?

> `optional` **onDrag?**: `DragEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2381

#### Inherited from

`CopilotInputProps.onDrag`

***

### onDragCapture?

> `optional` **onDragCapture?**: `DragEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2382

#### Inherited from

`CopilotInputProps.onDragCapture`

***

### onDragEnd?

> `optional` **onDragEnd?**: `DragEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2383

#### Inherited from

`CopilotInputProps.onDragEnd`

***

### onDragEndCapture?

> `optional` **onDragEndCapture?**: `DragEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2384

#### Inherited from

`CopilotInputProps.onDragEndCapture`

***

### onDragEnter?

> `optional` **onDragEnter?**: `DragEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2385

#### Inherited from

`CopilotInputProps.onDragEnter`

***

### onDragEnterCapture?

> `optional` **onDragEnterCapture?**: `DragEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2386

#### Inherited from

`CopilotInputProps.onDragEnterCapture`

***

### onDragExit?

> `optional` **onDragExit?**: `DragEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2387

#### Inherited from

`CopilotInputProps.onDragExit`

***

### onDragExitCapture?

> `optional` **onDragExitCapture?**: `DragEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2388

#### Inherited from

`CopilotInputProps.onDragExitCapture`

***

### onDragLeave?

> `optional` **onDragLeave?**: `DragEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2389

#### Inherited from

`CopilotInputProps.onDragLeave`

***

### onDragLeaveCapture?

> `optional` **onDragLeaveCapture?**: `DragEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2390

#### Inherited from

`CopilotInputProps.onDragLeaveCapture`

***

### onDragOver?

> `optional` **onDragOver?**: `DragEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2391

#### Inherited from

`CopilotInputProps.onDragOver`

***

### onDragOverCapture?

> `optional` **onDragOverCapture?**: `DragEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2392

#### Inherited from

`CopilotInputProps.onDragOverCapture`

***

### onDragStart?

> `optional` **onDragStart?**: `DragEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2393

#### Inherited from

`CopilotInputProps.onDragStart`

***

### onDragStartCapture?

> `optional` **onDragStartCapture?**: `DragEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2394

#### Inherited from

`CopilotInputProps.onDragStartCapture`

***

### onDrop?

> `optional` **onDrop?**: `DragEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2395

#### Inherited from

`CopilotInputProps.onDrop`

***

### onDropCapture?

> `optional` **onDropCapture?**: `DragEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2396

#### Inherited from

`CopilotInputProps.onDropCapture`

***

### onDurationChange?

> `optional` **onDurationChange?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2333

#### Inherited from

`CopilotInputProps.onDurationChange`

***

### onDurationChangeCapture?

> `optional` **onDurationChangeCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2334

#### Inherited from

`CopilotInputProps.onDurationChangeCapture`

***

### onEmptied?

> `optional` **onEmptied?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2335

#### Inherited from

`CopilotInputProps.onEmptied`

***

### onEmptiedCapture?

> `optional` **onEmptiedCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2336

#### Inherited from

`CopilotInputProps.onEmptiedCapture`

***

### onEncrypted?

> `optional` **onEncrypted?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2337

#### Inherited from

`CopilotInputProps.onEncrypted`

***

### onEncryptedCapture?

> `optional` **onEncryptedCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2338

#### Inherited from

`CopilotInputProps.onEncryptedCapture`

***

### onEnded?

> `optional` **onEnded?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2339

#### Inherited from

`CopilotInputProps.onEnded`

***

### onEndedCapture?

> `optional` **onEndedCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2340

#### Inherited from

`CopilotInputProps.onEndedCapture`

***

### onError?

> `optional` **onError?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2313

#### Inherited from

`CopilotInputProps.onError`

***

### onErrorCapture?

> `optional` **onErrorCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2314

#### Inherited from

`CopilotInputProps.onErrorCapture`

***

### onFinishTranscribe?

> `optional` **onFinishTranscribe?**: () => `void`

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:665

#### Returns

`void`

#### Inherited from

`CopilotInputProps.onFinishTranscribe`

***

### onFinishTranscribeWithAudio?

> `optional` **onFinishTranscribeWithAudio?**: (`audioBlob`) => `Promise`\<`void`\>

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:666

#### Parameters

##### audioBlob

`Blob`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`CopilotInputProps.onFinishTranscribeWithAudio`

***

### onFocus?

> `optional` **onFocus?**: `FocusEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2291

#### Inherited from

`CopilotInputProps.onFocus`

***

### onFocusCapture?

> `optional` **onFocusCapture?**: `FocusEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2292

#### Inherited from

`CopilotInputProps.onFocusCapture`

***

### onGotPointerCapture?

> `optional` **onGotPointerCapture?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2439

#### Inherited from

`CopilotInputProps.onGotPointerCapture`

***

### onGotPointerCaptureCapture?

> `optional` **onGotPointerCaptureCapture?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2440

#### Inherited from

`CopilotInputProps.onGotPointerCaptureCapture`

***

### onInput?

> `optional` **onInput?**: `InputEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2301

#### Inherited from

`CopilotInputProps.onInput`

***

### onInputCapture?

> `optional` **onInputCapture?**: `InputEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2302

#### Inherited from

`CopilotInputProps.onInputCapture`

***

### onInvalid?

> `optional` **onInvalid?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2307

#### Inherited from

`CopilotInputProps.onInvalid`

***

### onInvalidCapture?

> `optional` **onInvalidCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2308

#### Inherited from

`CopilotInputProps.onInvalidCapture`

***

### onKeyDown?

> `optional` **onKeyDown?**: `KeyboardEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2317

#### Inherited from

`CopilotInputProps.onKeyDown`

***

### onKeyDownCapture?

> `optional` **onKeyDownCapture?**: `KeyboardEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2318

#### Inherited from

`CopilotInputProps.onKeyDownCapture`

***

### ~~onKeyPress?~~

> `optional` **onKeyPress?**: `KeyboardEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2320

#### Deprecated

Use `onKeyUp` or `onKeyDown` instead

#### Inherited from

`CopilotInputProps.onKeyPress`

***

### ~~onKeyPressCapture?~~

> `optional` **onKeyPressCapture?**: `KeyboardEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2322

#### Deprecated

Use `onKeyUpCapture` or `onKeyDownCapture` instead

#### Inherited from

`CopilotInputProps.onKeyPressCapture`

***

### onKeyUp?

> `optional` **onKeyUp?**: `KeyboardEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2323

#### Inherited from

`CopilotInputProps.onKeyUp`

***

### onKeyUpCapture?

> `optional` **onKeyUpCapture?**: `KeyboardEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2324

#### Inherited from

`CopilotInputProps.onKeyUpCapture`

***

### onLoad?

> `optional` **onLoad?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2311

#### Inherited from

`CopilotInputProps.onLoad`

***

### onLoadCapture?

> `optional` **onLoadCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2312

#### Inherited from

`CopilotInputProps.onLoadCapture`

***

### onLoadedData?

> `optional` **onLoadedData?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2341

#### Inherited from

`CopilotInputProps.onLoadedData`

***

### onLoadedDataCapture?

> `optional` **onLoadedDataCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2342

#### Inherited from

`CopilotInputProps.onLoadedDataCapture`

***

### onLoadedMetadata?

> `optional` **onLoadedMetadata?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2343

#### Inherited from

`CopilotInputProps.onLoadedMetadata`

***

### onLoadedMetadataCapture?

> `optional` **onLoadedMetadataCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2344

#### Inherited from

`CopilotInputProps.onLoadedMetadataCapture`

***

### onLoadStart?

> `optional` **onLoadStart?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2345

#### Inherited from

`CopilotInputProps.onLoadStart`

***

### onLoadStartCapture?

> `optional` **onLoadStartCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2346

#### Inherited from

`CopilotInputProps.onLoadStartCapture`

***

### onLostPointerCapture?

> `optional` **onLostPointerCapture?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2441

#### Inherited from

`CopilotInputProps.onLostPointerCapture`

***

### onLostPointerCaptureCapture?

> `optional` **onLostPointerCaptureCapture?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2442

#### Inherited from

`CopilotInputProps.onLostPointerCaptureCapture`

***

### onMouseDown?

> `optional` **onMouseDown?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2397

#### Inherited from

`CopilotInputProps.onMouseDown`

***

### onMouseDownCapture?

> `optional` **onMouseDownCapture?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2398

#### Inherited from

`CopilotInputProps.onMouseDownCapture`

***

### onMouseEnter?

> `optional` **onMouseEnter?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2399

#### Inherited from

`CopilotInputProps.onMouseEnter`

***

### onMouseLeave?

> `optional` **onMouseLeave?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2400

#### Inherited from

`CopilotInputProps.onMouseLeave`

***

### onMouseMove?

> `optional` **onMouseMove?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2401

#### Inherited from

`CopilotInputProps.onMouseMove`

***

### onMouseMoveCapture?

> `optional` **onMouseMoveCapture?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2402

#### Inherited from

`CopilotInputProps.onMouseMoveCapture`

***

### onMouseOut?

> `optional` **onMouseOut?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2403

#### Inherited from

`CopilotInputProps.onMouseOut`

***

### onMouseOutCapture?

> `optional` **onMouseOutCapture?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2404

#### Inherited from

`CopilotInputProps.onMouseOutCapture`

***

### onMouseOver?

> `optional` **onMouseOver?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2405

#### Inherited from

`CopilotInputProps.onMouseOver`

***

### onMouseOverCapture?

> `optional` **onMouseOverCapture?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2406

#### Inherited from

`CopilotInputProps.onMouseOverCapture`

***

### onMouseUp?

> `optional` **onMouseUp?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2407

#### Inherited from

`CopilotInputProps.onMouseUp`

***

### onMouseUpCapture?

> `optional` **onMouseUpCapture?**: `MouseEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2408

#### Inherited from

`CopilotInputProps.onMouseUpCapture`

***

### onPaste?

> `optional` **onPaste?**: `ClipboardEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2279

#### Inherited from

`CopilotInputProps.onPaste`

***

### onPasteCapture?

> `optional` **onPasteCapture?**: `ClipboardEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2280

#### Inherited from

`CopilotInputProps.onPasteCapture`

***

### onPause?

> `optional` **onPause?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2347

#### Inherited from

`CopilotInputProps.onPause`

***

### onPauseCapture?

> `optional` **onPauseCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2348

#### Inherited from

`CopilotInputProps.onPauseCapture`

***

### onPlay?

> `optional` **onPlay?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2349

#### Inherited from

`CopilotInputProps.onPlay`

***

### onPlayCapture?

> `optional` **onPlayCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2350

#### Inherited from

`CopilotInputProps.onPlayCapture`

***

### onPlaying?

> `optional` **onPlaying?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2351

#### Inherited from

`CopilotInputProps.onPlaying`

***

### onPlayingCapture?

> `optional` **onPlayingCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2352

#### Inherited from

`CopilotInputProps.onPlayingCapture`

***

### onPointerCancel?

> `optional` **onPointerCancel?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2431

#### Inherited from

`CopilotInputProps.onPointerCancel`

***

### onPointerCancelCapture?

> `optional` **onPointerCancelCapture?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2432

#### Inherited from

`CopilotInputProps.onPointerCancelCapture`

***

### onPointerDown?

> `optional` **onPointerDown?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2425

#### Inherited from

`CopilotInputProps.onPointerDown`

***

### onPointerDownCapture?

> `optional` **onPointerDownCapture?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2426

#### Inherited from

`CopilotInputProps.onPointerDownCapture`

***

### onPointerEnter?

> `optional` **onPointerEnter?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2433

#### Inherited from

`CopilotInputProps.onPointerEnter`

***

### onPointerLeave?

> `optional` **onPointerLeave?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2434

#### Inherited from

`CopilotInputProps.onPointerLeave`

***

### onPointerMove?

> `optional` **onPointerMove?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2427

#### Inherited from

`CopilotInputProps.onPointerMove`

***

### onPointerMoveCapture?

> `optional` **onPointerMoveCapture?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2428

#### Inherited from

`CopilotInputProps.onPointerMoveCapture`

***

### onPointerOut?

> `optional` **onPointerOut?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2437

#### Inherited from

`CopilotInputProps.onPointerOut`

***

### onPointerOutCapture?

> `optional` **onPointerOutCapture?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2438

#### Inherited from

`CopilotInputProps.onPointerOutCapture`

***

### onPointerOver?

> `optional` **onPointerOver?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2435

#### Inherited from

`CopilotInputProps.onPointerOver`

***

### onPointerOverCapture?

> `optional` **onPointerOverCapture?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2436

#### Inherited from

`CopilotInputProps.onPointerOverCapture`

***

### onPointerUp?

> `optional` **onPointerUp?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2429

#### Inherited from

`CopilotInputProps.onPointerUp`

***

### onPointerUpCapture?

> `optional` **onPointerUpCapture?**: `PointerEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2430

#### Inherited from

`CopilotInputProps.onPointerUpCapture`

***

### onProgress?

> `optional` **onProgress?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2353

#### Inherited from

`CopilotInputProps.onProgress`

***

### onProgressCapture?

> `optional` **onProgressCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2354

#### Inherited from

`CopilotInputProps.onProgressCapture`

***

### onRateChange?

> `optional` **onRateChange?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2355

#### Inherited from

`CopilotInputProps.onRateChange`

***

### onRateChangeCapture?

> `optional` **onRateChangeCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2356

#### Inherited from

`CopilotInputProps.onRateChangeCapture`

***

### onReset?

> `optional` **onReset?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2303

#### Inherited from

`CopilotInputProps.onReset`

***

### onResetCapture?

> `optional` **onResetCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2304

#### Inherited from

`CopilotInputProps.onResetCapture`

***

### onScroll?

> `optional` **onScroll?**: `UIEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2445

#### Inherited from

`CopilotInputProps.onScroll`

***

### onScrollCapture?

> `optional` **onScrollCapture?**: `UIEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2446

#### Inherited from

`CopilotInputProps.onScrollCapture`

***

### onScrollEnd?

> `optional` **onScrollEnd?**: `UIEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2447

#### Inherited from

`CopilotInputProps.onScrollEnd`

***

### onScrollEndCapture?

> `optional` **onScrollEndCapture?**: `UIEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2448

#### Inherited from

`CopilotInputProps.onScrollEndCapture`

***

### onSeeked?

> `optional` **onSeeked?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2357

#### Inherited from

`CopilotInputProps.onSeeked`

***

### onSeekedCapture?

> `optional` **onSeekedCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2358

#### Inherited from

`CopilotInputProps.onSeekedCapture`

***

### onSeeking?

> `optional` **onSeeking?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2359

#### Inherited from

`CopilotInputProps.onSeeking`

***

### onSeekingCapture?

> `optional` **onSeekingCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2360

#### Inherited from

`CopilotInputProps.onSeekingCapture`

***

### onSelect?

> `optional` **onSelect?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2411

#### Inherited from

`CopilotInputProps.onSelect`

***

### onSelectCapture?

> `optional` **onSelectCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2412

#### Inherited from

`CopilotInputProps.onSelectCapture`

***

### onStalled?

> `optional` **onStalled?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2361

#### Inherited from

`CopilotInputProps.onStalled`

***

### onStalledCapture?

> `optional` **onStalledCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2362

#### Inherited from

`CopilotInputProps.onStalledCapture`

***

### onStartTranscribe?

> `optional` **onStartTranscribe?**: () => `void`

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:663

#### Returns

`void`

#### Inherited from

`CopilotInputProps.onStartTranscribe`

***

### onStop?

> `optional` **onStop?**: () => `void`

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:661

#### Returns

`void`

#### Inherited from

`CopilotInputProps.onStop`

***

### onSubmit?

> `optional` **onSubmit?**: `SubmitEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2305

#### Inherited from

`CopilotInputProps.onSubmit`

***

### onSubmitCapture?

> `optional` **onSubmitCapture?**: `SubmitEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2306

#### Inherited from

`CopilotInputProps.onSubmitCapture`

***

### onSubmitMessage?

> `optional` **onSubmitMessage?**: (`value`) => `void`

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:660

#### Parameters

##### value

`string`

#### Returns

`void`

#### Inherited from

`CopilotInputProps.onSubmitMessage`

***

### onSuspend?

> `optional` **onSuspend?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2363

#### Inherited from

`CopilotInputProps.onSuspend`

***

### onSuspendCapture?

> `optional` **onSuspendCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2364

#### Inherited from

`CopilotInputProps.onSuspendCapture`

***

### onTimeUpdate?

> `optional` **onTimeUpdate?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2365

#### Inherited from

`CopilotInputProps.onTimeUpdate`

***

### onTimeUpdateCapture?

> `optional` **onTimeUpdateCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2366

#### Inherited from

`CopilotInputProps.onTimeUpdateCapture`

***

### onToggle?

> `optional` **onToggle?**: `ToggleEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2463

#### Inherited from

`CopilotInputProps.onToggle`

***

### onTouchCancel?

> `optional` **onTouchCancel?**: `TouchEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2415

#### Inherited from

`CopilotInputProps.onTouchCancel`

***

### onTouchCancelCapture?

> `optional` **onTouchCancelCapture?**: `TouchEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2416

#### Inherited from

`CopilotInputProps.onTouchCancelCapture`

***

### onTouchEnd?

> `optional` **onTouchEnd?**: `TouchEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2417

#### Inherited from

`CopilotInputProps.onTouchEnd`

***

### onTouchEndCapture?

> `optional` **onTouchEndCapture?**: `TouchEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2418

#### Inherited from

`CopilotInputProps.onTouchEndCapture`

***

### onTouchMove?

> `optional` **onTouchMove?**: `TouchEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2419

#### Inherited from

`CopilotInputProps.onTouchMove`

***

### onTouchMoveCapture?

> `optional` **onTouchMoveCapture?**: `TouchEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2420

#### Inherited from

`CopilotInputProps.onTouchMoveCapture`

***

### onTouchStart?

> `optional` **onTouchStart?**: `TouchEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2421

#### Inherited from

`CopilotInputProps.onTouchStart`

***

### onTouchStartCapture?

> `optional` **onTouchStartCapture?**: `TouchEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2422

#### Inherited from

`CopilotInputProps.onTouchStartCapture`

***

### onTransitionCancel?

> `optional` **onTransitionCancel?**: `TransitionEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2467

#### Inherited from

`CopilotInputProps.onTransitionCancel`

***

### onTransitionCancelCapture?

> `optional` **onTransitionCancelCapture?**: `TransitionEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2468

#### Inherited from

`CopilotInputProps.onTransitionCancelCapture`

***

### onTransitionEnd?

> `optional` **onTransitionEnd?**: `TransitionEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2469

#### Inherited from

`CopilotInputProps.onTransitionEnd`

***

### onTransitionEndCapture?

> `optional` **onTransitionEndCapture?**: `TransitionEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2470

#### Inherited from

`CopilotInputProps.onTransitionEndCapture`

***

### onTransitionRun?

> `optional` **onTransitionRun?**: `TransitionEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2471

#### Inherited from

`CopilotInputProps.onTransitionRun`

***

### onTransitionRunCapture?

> `optional` **onTransitionRunCapture?**: `TransitionEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2472

#### Inherited from

`CopilotInputProps.onTransitionRunCapture`

***

### onTransitionStart?

> `optional` **onTransitionStart?**: `TransitionEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2473

#### Inherited from

`CopilotInputProps.onTransitionStart`

***

### onTransitionStartCapture?

> `optional` **onTransitionStartCapture?**: `TransitionEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2474

#### Inherited from

`CopilotInputProps.onTransitionStartCapture`

***

### onVolumeChange?

> `optional` **onVolumeChange?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2367

#### Inherited from

`CopilotInputProps.onVolumeChange`

***

### onVolumeChangeCapture?

> `optional` **onVolumeChangeCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2368

#### Inherited from

`CopilotInputProps.onVolumeChangeCapture`

***

### onWaiting?

> `optional` **onWaiting?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2369

#### Inherited from

`CopilotInputProps.onWaiting`

***

### onWaitingCapture?

> `optional` **onWaitingCapture?**: `ReactEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2370

#### Inherited from

`CopilotInputProps.onWaitingCapture`

***

### onWheel?

> `optional` **onWheel?**: `WheelEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2451

#### Inherited from

`CopilotInputProps.onWheel`

***

### onWheelCapture?

> `optional` **onWheelCapture?**: `WheelEventHandler`\<`HTMLDivElement`\>

Defined in: node\_modules/@types/react/index.d.ts:2452

#### Inherited from

`CopilotInputProps.onWheelCapture`

***

### part?

> `optional` **part?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2872

#### See

[https://developer.mozilla.org/en-US/docs/Web/HTML/Global\_attributes/part](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/part)

#### Inherited from

`CopilotInputProps.part`

***

### popover?

> `optional` **popover?**: `""` \| `"auto"` \| `"manual"` \| `"hint"`

Defined in: node\_modules/@types/react/index.d.ts:2846

#### Inherited from

`CopilotInputProps.popover`

***

### popoverTarget?

> `optional` **popoverTarget?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2848

#### Inherited from

`CopilotInputProps.popoverTarget`

***

### popoverTargetAction?

> `optional` **popoverTargetAction?**: `"toggle"` \| `"show"` \| `"hide"`

Defined in: node\_modules/@types/react/index.d.ts:2847

#### Inherited from

`CopilotInputProps.popoverTargetAction`

***

### positioning?

> `optional` **positioning?**: `"static"` \| `"absolute"`

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:670

#### Inherited from

`CopilotInputProps.positioning`

***

### prefix?

> `optional` **prefix?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2824

#### Inherited from

`CopilotInputProps.prefix`

***

### property?

> `optional` **property?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2825

#### Inherited from

`CopilotInputProps.property`

***

### radioGroup?

> `optional` **radioGroup?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2814

#### Inherited from

`CopilotInputProps.radioGroup`

***

### rel?

> `optional` **rel?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2826

#### Inherited from

`CopilotInputProps.rel`

***

### resource?

> `optional` **resource?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2827

#### Inherited from

`CopilotInputProps.resource`

***

### results?

> `optional` **results?**: `number`

Defined in: node\_modules/@types/react/index.d.ts:2841

#### Inherited from

`CopilotInputProps.results`

***

### rev?

> `optional` **rev?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2828

#### Inherited from

`CopilotInputProps.rev`

***

### role?

> `optional` **role?**: `AriaRole`

Defined in: node\_modules/@types/react/index.d.ts:2817

#### Inherited from

`CopilotInputProps.role`

***

### security?

> `optional` **security?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2842

#### Inherited from

`CopilotInputProps.security`

***

### sendButton?

> `optional` **sendButton?**: `SlotValue`\<`FC`\<`ButtonHTMLAttributes`\<`HTMLButtonElement`\>\>\>

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:648

#### Inherited from

`CopilotInputProps.sendButton`

***

### showDisclaimer?

> `optional` **showDisclaimer?**: `boolean`

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:673

#### Inherited from

`CopilotInputProps.showDisclaimer`

***

### slot?

> `optional` **slot?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2806

#### Inherited from

`CopilotInputProps.slot`

***

### spellCheck?

> `optional` **spellCheck?**: `Booleanish`

Defined in: node\_modules/@types/react/index.d.ts:2807

#### Inherited from

`CopilotInputProps.spellCheck`

***

### startTranscribeButton?

> `optional` **startTranscribeButton?**: `SlotValue`\<`FC`\<`ButtonHTMLAttributes`\<`HTMLButtonElement`\>\>\>

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:649

#### Inherited from

`CopilotInputProps.startTranscribeButton`

***

### style?

> `optional` **style?**: `CSSProperties`

Defined in: node\_modules/@types/react/index.d.ts:2808

#### Inherited from

`CopilotInputProps.style`

***

### suppressContentEditableWarning?

> `optional` **suppressContentEditableWarning?**: `boolean`

Defined in: node\_modules/@types/react/index.d.ts:2789

#### Inherited from

`CopilotInputProps.suppressContentEditableWarning`

***

### suppressHydrationWarning?

> `optional` **suppressHydrationWarning?**: `boolean`

Defined in: node\_modules/@types/react/index.d.ts:2790

#### Inherited from

`CopilotInputProps.suppressHydrationWarning`

***

### tabIndex?

> `optional` **tabIndex?**: `number`

Defined in: node\_modules/@types/react/index.d.ts:2809

#### Inherited from

`CopilotInputProps.tabIndex`

***

### textArea?

> `optional` **textArea?**: `SlotValue`\<`ForwardRefExoticComponent`\<`TextAreaProps` & `RefAttributes`\<`HTMLTextAreaElement`\>\>\>

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:647

#### Inherited from

`CopilotInputProps.textArea`

***

### title?

> `optional` **title?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2810

#### Inherited from

`CopilotInputProps.title`

***

### toolsMenu?

> `optional` **toolsMenu?**: (`ToolsMenuItem` \| `"-"`)[]

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:658

#### Inherited from

`CopilotInputProps.toolsMenu`

***

### translate?

> `optional` **translate?**: `"yes"` \| `"no"`

Defined in: node\_modules/@types/react/index.d.ts:2811

#### Inherited from

`CopilotInputProps.translate`

***

### trigger?

> `optional` **trigger?**: `string`

Defined in: src/references/ReferenceInput.tsx:33

Character that opens the reference popover from the editor. Default `"@"`.

***

### typeof?

> `optional` **typeof?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2829

#### Inherited from

`CopilotInputProps.typeof`

***

### unselectable?

> `optional` **unselectable?**: `"off"` \| `"on"`

Defined in: node\_modules/@types/react/index.d.ts:2843

#### Inherited from

`CopilotInputProps.unselectable`

***

### value?

> `optional` **value?**: `string`

Defined in: node\_modules/@copilotkit/react-core/dist/copilotkit-Bp6BD8xe.d.mts:668

#### Inherited from

`CopilotInputProps.value`

***

### vocab?

> `optional` **vocab?**: `string`

Defined in: node\_modules/@types/react/index.d.ts:2830

#### Inherited from

`CopilotInputProps.vocab`
