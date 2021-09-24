function validateEventModel(event) {
    if (!event.name) return false;
    if (!event.type) return false;
    if (!event.location) return false;
    if (!event.date) return false;
    return true;
}

export { validateEventModel };