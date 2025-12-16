export const ruleHandlers = {
    transport: (value, context) => value === "all" || value === context.transport,

    exclude_transport: (value, context) => value !== context.transport,
    
    min_price: (value, context) => context.price >= value,
    
    max_price: (value, context) => context.price <= value,
    
    class: (value, context) => context.class === value
};

export function validatePromoConditions(conditions, context) {
    for (const key in conditions) {
        const handler = ruleHandlers[key];
        if (!handler) continue; // ignore les règles inconnues
        if (!handler(conditions[key], context)) return false;
    }
    return true;
}