export const decodeSubjectAction = (encodedData: string) => {
  const [action, subj] = encodedData.split(':') as [string, string];
  return {
    action,
    subj,
  };
};
export const encodeSubjectAction = (
  subjectAction: string,
  subject: number | string
) => `${subjectAction}:${subject}`;
export const SubjectWithAction = (subj: string) => new RegExp(`^${subj}:(.+)$`);
