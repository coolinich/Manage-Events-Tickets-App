export interface TicketModel {
    validationCode: string;
    status: string;
    eventRef: string;
    description?: string; 
}

export interface TickesStats {
    "sold": number;
    "validated": number;
}
