export interface YouthEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  location: string | null;
  dynamic_data: Record<string, unknown>;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  polls?: {
    id: string;
    question: string;
    options: { id: string; text: string }[];
  }[];
}

export interface EventRsvp {
  id: string;
  event_id: string;
  user_id: string;
  status: "attending" | "maybe" | "not_attending";
  payment_status: "paid" | "unpaid";
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

export interface EventPoll {
  id: string;
  event_id: string;
  question: string;
  created_at: string;
  event_poll_options?: EventPollOption[];
}

export interface EventPollOption {
  id: string;
  poll_id: string;
  text: string;
  created_at: string;
  votes_count?: number; // computed
}

export interface EventPollVote {
  id: string;
  poll_id: string;
  option_id: string;
  user_id: string;
  created_at: string;
}

export interface EventPhoto {
  id: string;
  event_id: string;
  url: string;
  caption: string | null;
  uploaded_by: string | null;
  created_at: string;
}

export interface EventComment {
  id: string;
  event_id: string;
  user_id: string;
  text: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
  };
}
