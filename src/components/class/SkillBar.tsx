import type { SkillSlot } from '@/lib/types/classes';

interface SkillBarProps {
  title: string;
  skills: SkillSlot[];
}

export default function SkillBar({ title, skills }: SkillBarProps) {
  return (
    <>
      <h3 className="sub-heading">{title}</h3>
      <div className="skill-bar">
        {skills.map((skill, index) => (
          <div key={index} className="skill-slot">
            <span className="skill-slot-label">{skill.label}</span>
            <span className="skill-slot-name">{skill.name}</span>
          </div>
        ))}
      </div>
    </>
  );
}
