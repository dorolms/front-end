interface AssignPageProps {
  params: { id: string };
}

export default function InstructorLectureAssignPage({
  params,
}: AssignPageProps) {
  return <h1>🧾 This is Instructor Lecture Assign Page — ID: {params.id}</h1>;
}
