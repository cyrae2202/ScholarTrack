export interface Scholarship {
  id: string;
  title: string;
  description: string;
  amount: number;
  deadline: string;
}

export interface Application {
  id: string;
  scholarship_id: string;
  scholarship_title: string;
  status: string;
}

export type Opportunity = {
  id: string;
  title: string;
  type: 'Internship' | 'Scholarship' | 'Competition';
  organization: string;
  description: string;
  applicationLink: string;
  deadline: string;
  status: 'Saved' | 'Planning' | 'Applying' | 'Submitted' | 'Accepted' | 'Rejected';
};
