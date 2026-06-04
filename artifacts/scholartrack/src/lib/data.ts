import { Scholarship, Application, Opportunity } from './definitions';

export const scholarships: Scholarship[] = [
  {
    id: '1',
    title: 'Google Scholarship',
    description: 'A scholarship for computer science students.',
    amount: 10000,
    deadline: '2024-12-31',
  },
  {
    id: '2',
    title: 'Facebook Scholarship',
    description: 'A scholarship for students interested in social media.',
    amount: 5000,
    deadline: '2025-01-15',
  },
];

export const applications: Application[] = [
  {
    id: '1',
    scholarship_id: '1',
    scholarship_title: 'Google Scholarship',
    status: 'Submitted',
  },
];

export const opportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Google Summer of Code',
    type: 'Internship',
    organization: 'Google',
    description: 'A global program focused on bringing more student developers into open source software development.',
    applicationLink: 'https://summerofcode.withgoogle.com/',
    deadline: '2025-03-15',
    status: 'Saved',
  },
  {
    id: '2',
    title: 'Rhodes Scholarship',
    type: 'Scholarship',
    organization: 'Rhodes Trust',
    description: 'A postgraduate award for students to study at the University of Oxford.',
    applicationLink: 'https://www.rhodeshouse.ox.ac.uk/scholarships/the-rhodes-scholarship/',
    deadline: '2024-10-02',
    status: 'Planning',
  },
  {
    id: '3',
    title: 'Imagine Cup',
    type: 'Competition',
    organization: 'Microsoft',
    description: 'A global competition for students to create innovative technology solutions.',
    applicationLink: 'https://imaginecup.microsoft.com/',
    deadline: '2025-01-20',
    status: 'Applying',
  },
];

export const fetchScholarships = async (): Promise<Scholarship[]> => {
  return Promise.resolve(scholarships);
};

export const fetchScholarshipById = async (id: string): Promise<Scholarship | undefined> => {
  return Promise.resolve(scholarships.find((s) => s.id === id));
};

export const fetchApplications = async (): Promise<Application[]> => {
  return Promise.resolve(applications);
};

export const fetchOpportunityById = (id: string): Opportunity | undefined => {
  return opportunities.find(op => op.id === id);
};
