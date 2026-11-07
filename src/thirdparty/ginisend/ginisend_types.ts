export interface GinisendEmailRequest {
  to: string;
  subject: string;
  message: string;
  bcc?: string[];
  cc?: string[];
  display_name?: string;
  //attachments?: IEmailAttachment[];
}

export interface GinisendEmailResponse {
  message_id: string;
  recipient: string;
  status: string;
  error?: string;
}
