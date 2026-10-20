const matches = (input, pattern) => {
    const normalized = input.replaceAll("\\", "/");
    let escaped = pattern
        .replaceAll("\\", "/")
        .replace(/[.+^${}()|[\]\\]/g, "\\$&")
        .replace(/\*/g, ".*")
        .replace(/\?/g, ".");
    if (escaped.endsWith(" .*"))
        escaped = escaped.slice(0, -3) + "( .*)?";
    return new RegExp(`^${escaped}$`, process.platform === "win32" ? "si" : "s").test(normalized);
};
const isReviewAsk = (rule) => rule.effect === "ask" && rule.action === "shell" && rule.resource === "*";
export const hasExplicitAsk = (action, resources, rules) => resources.some((resource) => {
    for (let index = rules.length - 1; index >= 0; index--) {
        const rule = rules[index];
        if (matches(action, rule.action) && matches(resource, rule.resource)) {
            return rule.effect === "ask" && !isReviewAsk(rule);
        }
    }
    return false;
});
