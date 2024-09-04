console.log(opts);
const getParameterProxyHandler = {
  apply: function (target, ctx, args) {
    const param = (args || [])[0];
    const result = utils.cache.Reflect.apply(target, ctx, args);
    // UNMASKED_VENDOR_WEBGL
    if (param === 37445) {
      return opts.vendor || "Intel Inc."; // default in headless: Google Inc.
    }
    // UNMASKED_RENDERER_WEBGL
    if (param === 37446) {
      return opts.renderer || "Intel Iris OpenGL Engine"; // default in headless: Google SwiftShader
    }
    return result;
  },
};

// There's more than one WebGL rendering context
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext#Browser_compatibility
// To find out the original values here: Object.getOwnPropertyDescriptors(WebGLRenderingContext.prototype.getParameter)
const addProxy = (obj, propName) => {
  utils.replaceWithProxy(obj, propName, getParameterProxyHandler);
};
// For whatever weird reason loops don't play nice with Object.defineProperty, here's the next best thing:
addProxy(WebGLRenderingContext.prototype, "getParameter");
addProxy(WebGL2RenderingContext.prototype, "getParameter");
