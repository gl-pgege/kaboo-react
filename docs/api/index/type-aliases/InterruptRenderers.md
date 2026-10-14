[**@pgege/kaboo-react**](../../README.md)

***

# Type Alias: InterruptRenderers

> **InterruptRenderers** = `Record`\<`string`, `ComponentType`\<[`InterruptRendererProps`](../interfaces/InterruptRendererProps.md)\<`any`\>\> \| `undefined`\>

Defined in: [src/context/InterruptRenderers.tsx:9](https://github.com/gl-pgege/kaboo-react/blob/main/src/context/InterruptRenderers.tsx#L9)

Interrupt renderer overrides, keyed by the request's `reason.type`: the
built-in `approval` and `form`, or an app's own kind such as `files`.
