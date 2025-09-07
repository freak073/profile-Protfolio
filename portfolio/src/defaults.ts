/**
 * Gets the original marked default options.
 */
export function _getDefaults() {
    return {
        async: false,
        breaks: false,
        extensions: null,
        gfm: true,
        hooks: null,
        pedantic: false,
        renderer: null,
        silent: false,
        tokenizer: null,
        walkTokens: null
    };
}
export let _defaults = _getDefaults();
export function changeDefaults(newDefaults) {
    _defaults = newDefaults;
}
