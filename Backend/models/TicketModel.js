function validateTicketModel(ticket) {
    if (!ticket.validationCode) return false;
    if (!ticket.status) return false;
    if (!ticket.eventRef) return false;
    return true;
}

export { validateTicketModel };