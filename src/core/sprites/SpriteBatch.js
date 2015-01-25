var Container = require('../display/Container');

/**
 * The SpriteBatch class is a really fast version of the Container built solely for speed,
 * so use when you need a lot of sprites or particles. The tradeoff of the SpriteBatch is that advanced
 * functionality will not work. SpriteBatch implements only the basic object transform (position, scale, rotation).
 * Any other functionality like tinting, masking, etc will not work on sprites in this batch.
 *
 * It's extremely easy to use :
 *
 * ```js
 * var container = new SpriteBatch();
 *
 * for(var i = 0; i < 100; ++i)
 * {
 *     var sprite = new PIXI.Sprite.fromImage("myImage.png");
 *     container.addChild(sprite);
 * }
 * ```
 *
 * And here you have a hundred sprites that will be renderer at the speed of light.
 *
 * @class
 * @namespace PIXI
 */

//TODO RENAME to PARTICLE CONTAINER?
function SpriteBatch()
{
    Container.call(this);
}

SpriteBatch.prototype = Object.create(Container.prototype);
SpriteBatch.prototype.constructor = SpriteBatch;
module.exports = SpriteBatch;

/**
 * Updates the object transform for rendering
 *
 * @private
 */
SpriteBatch.prototype.updateTransform = function ()
{
    // TODO don't need to!
    this.displayObjectUpdateTransform();
    //  PIXI.Container.prototype.updateTransform.call( this );
};

/**
 * Renders the object using the WebGL renderer
 *
 * @param renderer {WebGLRenderer} The webgl renderer
 * @private
 */
SpriteBatch.prototype.renderWebGL = function (renderer)
{
    if (!this.visible || this.alpha <= 0 || !this.children.length)
    {
        return;
    }

    // renderer.spriteBatch.stop();

    // renderer.shaderManager.setShader(renderer.shaderManager.plugins.fastShader);

    // renderer.fastSpriteBatch.begin(this);
    // renderer.fastSpriteBatch.render(this);

    // renderer.spriteBatch.start();

    renderer.currentRenderer.stop();

    renderer.shaderManager.setShader(renderer.plugins.spriteBatch.shader);

    renderer.plugins.spriteBatch.start(this);
    renderer.plugins.spriteBatch.render(this);

    renderer.currentRenderer.start();
};

/**
 * Renders the object using the Canvas renderer
 *
 * @param renderer {CanvasRenderer} The canvas renderer
 * @private
 */
SpriteBatch.prototype.renderCanvas = function (renderer)
{
    if (!this.visible || this.alpha <= 0 || !this.children.length)
    {
        return;
    }

    var context = renderer.context;
    var transform = this.worldTransform;
    var isRotated = true;

    context.globalAlpha = this.worldAlpha;

    this.displayObjectUpdateTransform();

    for (var i = 0; i < this.children.length; ++i)
    {
        var child = this.children[i];

        if (!child.visible)
        {
            continue;
        }

        var frame = child.texture.frame;

        context.globalAlpha = this.worldAlpha * child.alpha;

        if (child.rotation % (Math.PI * 2) === 0)
        {
            // this is the fastest  way to optimise! - if rotation is 0 then we can avoid any kind of setTransform call
            if (isRotated)
            {
                context.setTransform(
                    transform.a,
                    transform.b,
                    transform.c,
                    transform.d,
                    transform.tx,
                    transform.ty
                );

                isRotated = false;
            }

            context.drawImage(
                child.texture.baseTexture.source,
                frame.x,
                frame.y,
                frame.width,
                frame.height,
                ((child.anchor.x) * (-frame.width * child.scale.x) + child.position.x  + 0.5) | 0,
                ((child.anchor.y) * (-frame.height * child.scale.y) + child.position.y  + 0.5) | 0,
                frame.width * child.scale.x,
                frame.height * child.scale.y
            );
        }
        else
        {
            if (!isRotated)
            {
                isRotated = true;
            }

            child.displayObjectUpdateTransform();

            var childTransform = child.worldTransform;

            if (renderer.roundPixels)
            {
                context.setTransform(
                    childTransform.a,
                    childTransform.b,
                    childTransform.c,
                    childTransform.d,
                    childTransform.tx | 0,
                    childTransform.ty | 0
                );
            }
            else
            {
                context.setTransform(
                    childTransform.a,
                    childTransform.b,
                    childTransform.c,
                    childTransform.d,
                    childTransform.tx,
                    childTransform.ty
                );
            }

            context.drawImage(
                child.texture.baseTexture.source,
                frame.x,
                frame.y,
                frame.width,
                frame.height,
                ((child.anchor.x) * (-frame.width) + 0.5) | 0,
                ((child.anchor.y) * (-frame.height) + 0.5) | 0,
                frame.width,
                frame.height
            );
        }
    }
};
