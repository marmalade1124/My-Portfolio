const LEARNING_RESOURCES = [
  { title: 'Artificial Intelligence Fundamentals', provider: 'IBM SkillsBuild', area: 'AI foundations', outcome: 'Free digital credential after required courses, quizzes, assessments and simulations.', url: 'https://www.credly.com/org/ibm-skillsbuild/badge/artificial-intelligence-fundamentals' },
  { title: 'Model Context Protocol Course', provider: 'Hugging Face', area: 'AI application development', outcome: 'Free fundamentals certificate for Unit 1; completion certificate for the use-case units.', url: 'https://huggingface.co/learn/mcp-course/en/unit0/introduction' },
  { title: 'Networking Basics', provider: 'Cisco Networking Academy', area: 'Computer networks', outcome: 'Free course and student-level digital badge. The badge requires a passing comprehensive exam.', url: 'https://www.netacad.com/courses/networking-basics' },
  { title: 'Introduction to IoT and Digital Transformation', provider: 'Cisco Networking Academy', area: 'Connected hardware', outcome: 'Free introductory course with digital badges; complete the provider’s required activities and assessment.', url: 'https://www.netacad.com/courses/introduction-iot' },
  { title: 'Introduction to AI', provider: 'University of Helsinki / MinnaLearn', area: 'AI concepts and reasoning', outcome: 'Free digital course certificate after exercises and peer-review requirements. Building AI is a separate course with a paid certificate.', url: 'https://course.elementsofai.com/' },
];

export function Certifications() {
  return <section className="studio-certifications">
    <p className="studio-eyebrow">Professional learning</p>
    <h2>Learning, backed<br />by <em>evidence.</em></h2>
    <div className="studio-credentials-empty">
      <h3>Verified certificates</h3>
      <p>No certificates published yet. Completed credentials will appear here with their issuer, issue date and verification link.</p>
    </div>
    <details className="studio-learning-resources">
      <summary>Explore free learning paths <span>AI / Networking / IoT</span></summary>
      <p>These are learning resources, not credentials held or claims of enrollment. Course-completion certificates and digital badges are different from professional licensing or certification exams.</p>
      <div className="studio-learning-grid">{LEARNING_RESOURCES.map(course => <article key={course.title}>
        <p className="studio-eyebrow">{course.area}</p>
        <h3>{course.title}</h3>
        <p className="studio-course-provider">{course.provider}</p>
        <p>{course.outcome}</p>
        <a href={course.url} target="_blank" rel="noreferrer">View course & requirements ↗</a>
      </article>)}</div>
      <p className="studio-learning-checked">Provider information checked October 25, 2026. Requirements and availability can change.</p>
    </details>
  </section>;
}
