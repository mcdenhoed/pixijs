import type { Container } from '../rendering/scene/Container';

export type PointerEvents = 'auto'
| 'none'
| 'visiblePainted'
| 'visibleFill'
| 'visibleStroke'
| 'visible'
| 'painted'
| 'fill'
| 'stroke'
| 'all'
| 'inherit';

export interface AccessibleTarget
{
    accessible: boolean;
    accessibleTitle: string;
    accessibleHint: string;
    tabIndex: number;
    _accessibleActive: boolean;
    _accessibleDiv: AccessibleHTMLElement;
    accessibleType: string;
    accessiblePointerEvents: PointerEvents;
    accessibleChildren: boolean;
    renderId: number;
}

export interface AccessibleHTMLElement extends HTMLElement
{
    type?: string;
    container?: Container;
}

/**
 * Default property values of accessible objects
 * used by {@link PIXI.AccessibilityManager}.
 * @private
 * @function accessibleTarget
 * @memberof PIXI
 * @type {object}
 * @example
 * import { accessibleTarget } from 'pixi.js';
 *
 * function MyObject() {}
 * Object.assign(MyObject.prototype, accessibleTarget);
 */
export const accessibilityTarget: AccessibleTarget = {
    /**
     *  Flag for if the object is accessible. If true AccessibilityManager will overlay a
     *   shadow div with attributes set
     * @member {boolean}
     * @memberof PIXI.Container#
     */
    accessible: false,

    /**
     * Sets the title attribute of the shadow div
     * If accessibleTitle AND accessibleHint has not been this will default to 'container [tabIndex]'
     * @member {?string}
     * @memberof PIXI.Container#
     */
    accessibleTitle: null,

    /**
     * Sets the aria-label attribute of the shadow div
     * @member {string}
     * @memberof PIXI.Container#
     */
    accessibleHint: null,

    /**
     * @member {number}
     * @memberof PIXI.Container#
     * @private
     * @todo Needs docs.
     */
    tabIndex: 0,

    /**
     * @member {boolean}
     * @memberof PIXI.Container#
     * @todo Needs docs.
     */
    _accessibleActive: false,

    /**
     * @member {boolean}
     * @memberof PIXI.Container#
     * @todo Needs docs.
     */
    _accessibleDiv: null,

    /**
     * Specify the type of div the accessible layer is. Screen readers treat the element differently
     * depending on this type. Defaults to button.
     * @member {string}
     * @memberof PIXI.Container#
     * @default 'button'
     */
    accessibleType: 'button',

    /**
     * Specify the pointer-events the accessible div will use
     * Defaults to auto.
     * @member {string}
     * @memberof PIXI.Container#
     * @default 'auto'
     */
    accessiblePointerEvents: 'auto',

    /**
     * Setting to false will prevent any children inside this container to
     * be accessible. Defaults to true.
     * @member {boolean}
     * @memberof PIXI.Container#
     * @default true
     */
    accessibleChildren: true,

    renderId: -1,
};
