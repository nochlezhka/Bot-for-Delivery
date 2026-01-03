export const decodeSubjectAction = (encodedData: string) => {
  const [action, subj] = encodedData.split(':') as [string, string];
  return {
    subj,
    action,
  };
};
export const encodeSubjectAction = (
  subjectAction: string,
  subject: string | number
) => `${subjectAction}:${subject}`;
export const SubjectWithAction = (subj: string) => new RegExp(`^${subj}:(.+)$`);
