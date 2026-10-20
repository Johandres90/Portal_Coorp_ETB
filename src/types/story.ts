export interface ConnextraFormat {
  asA: string;
  iWant: string;
  soThat: string;
}

export interface AcceptanceCriterion {
  scenario: string;
  given: string;
  when: string;
  then: string;
}

export interface UserStory {
  id: string;
  title: string;
  priority: "Alta" | "Media" | "Baja";
  storyPoints: 3 | 5 | 8 | 13 | number;
  connextra: ConnextraFormat;
  acceptanceCriteria: AcceptanceCriterion[];
  businessRules: string[];
  createdAt?: string;
  updatedAt?: string;
  status?: "READY FOR SPRINT" | "DRAFT" | "IN REFINEMENT";
}

export type AgentResponseType = "clarification" | "user_story";

export interface AgentResponse {
  type: AgentResponseType;
  message: string;
  userStory: UserStory | null;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  agentData?: AgentResponse;
}

export interface StoredStory extends UserStory {
  savedAt: string;
}
