import Link from 'next/link';
import type { BuildWithDetails } from '@/lib/types/builds';
import { classData } from '@/lib/constants/classes';
import type { D4Class } from '@/lib/types/classes';
import VoteButton from '@/components/community/VoteButton';
import CommentThread from '@/components/community/CommentThread';

interface BuildDetailProps {
  build: BuildWithDetails;
  isOwner: boolean;
  userId?: string | null;
  hasVoted?: boolean;
}

export default function BuildDetail({ build, isOwner, userId, hasVoted }: BuildDetailProps) {
  const classMeta = classData[build.class as D4Class]?.meta;
  const activeSkills = build.skills
    .filter(s => !s.is_passive && s.slot)
    .sort((a, b) => (a.slot ?? 0) - (b.slot ?? 0));
  const passiveSkills = build.skills.filter(s => s.is_passive);
  const unslottedSkills = build.skills.filter(s => !s.is_passive && !s.slot);

  const createdDate = new Date(build.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="build-detail">
      <div className="container">
        {/* Header */}
        <div className="build-detail-header">
          <VoteButton
            buildId={build.id}
            initialVoteCount={build.vote_count}
            initialHasVoted={hasVoted ?? false}
            userId={userId ?? null}
          />
          <div
            className="build-detail-class-badge"
            style={{ borderColor: classMeta?.colorHex ?? 'var(--gold-dim)' }}
          >
            <span style={{ color: classMeta?.colorHex }}>{classMeta?.abbr ?? '?'}</span>
          </div>
          <div className="build-detail-header-info">
            <h1 className="build-detail-title">{build.title}</h1>
            <div className="build-detail-meta">
              <span style={{ color: classMeta?.colorHex }}>{classMeta?.name}</span>
              {build.author && (
                <>
                  <span className="build-detail-meta-sep">&middot;</span>
                  <span>{build.author.battletag ?? build.author.display_name}</span>
                </>
              )}
              <span className="build-detail-meta-sep">&middot;</span>
              <span>{createdDate}</span>
              {build.season && (
                <>
                  <span className="build-detail-meta-sep">&middot;</span>
                  <span>S{build.season}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Class guide link */}
        {classMeta && (
          <Link href={`/class/${classMeta.slug}`} className="build-detail-guide-link">
            View {classMeta.name} Class Guide &rarr;
          </Link>
        )}

        {/* Tags */}
        {build.tags.length > 0 && (
          <div className="build-detail-tags">
            {build.tags.map(tag => (
              <span key={tag} className="build-detail-tag">{tag}</span>
            ))}
            <span className="build-detail-tag build-detail-tag-visibility">
              {build.is_public ? 'Public' : 'Private'}
            </span>
          </div>
        )}

        {/* Description */}
        {build.description && (
          <div className="build-detail-section">
            <p className="build-detail-desc">{build.description}</p>
          </div>
        )}

        {/* Skill Bar */}
        {activeSkills.length > 0 && (
          <div className="build-detail-section">
            <h2 className="build-detail-section-title">Skill Bar</h2>
            <div className="skill-bar">
              {activeSkills.map((skill, i) => (
                <div key={i} className="skill-slot">
                  <span className="skill-slot-label">Slot {skill.slot}</span>
                  <span className="skill-slot-name">{skill.skill_name}</span>
                  {skill.points > 1 && (
                    <span className="skill-slot-points">{skill.points} pts</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unslotted active skills */}
        {unslottedSkills.length > 0 && (
          <div className="build-detail-section">
            <h2 className="build-detail-section-title">Additional Skills</h2>
            <div className="skill-bar">
              {unslottedSkills.map((skill, i) => (
                <div key={i} className="skill-slot">
                  <span className="skill-slot-label">Active</span>
                  <span className="skill-slot-name">{skill.skill_name}</span>
                  {skill.points > 1 && (
                    <span className="skill-slot-points">{skill.points} pts</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Passives */}
        {passiveSkills.length > 0 && (
          <div className="build-detail-section">
            <h2 className="build-detail-section-title">Passives</h2>
            <div className="skill-bar">
              {passiveSkills.map((skill, i) => (
                <div key={i} className="skill-slot">
                  <span className="skill-slot-label">Passive</span>
                  <span className="skill-slot-name">{skill.skill_name}</span>
                  {skill.points > 1 && (
                    <span className="skill-slot-points">{skill.points} pts</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gear */}
        {build.gear.length > 0 && (
          <div className="build-detail-section">
            <h2 className="build-detail-section-title">Gear</h2>
            <div className="gear-grid">
              {build.gear.map((g, i) => (
                <div key={i} className="gear-card">
                  <div className="gear-card-label">
                    {g.slot}
                    {g.is_unique && <span className="gear-unique-pip"> &#9670;</span>}
                  </div>
                  <div className="gear-card-name">{g.item_name}</div>
                  {g.affixes.length > 0 && (
                    <div className="gear-card-affixes">
                      {g.affixes.map((affix, j) => (
                        <span key={j} className="gear-affix-tag">{affix}</span>
                      ))}
                    </div>
                  )}
                  {g.notes && <div className="gear-card-desc">{g.notes}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Owner actions */}
        {isOwner && (
          <div className="build-detail-actions">
            <Link href={`/builds/${build.id}/edit`} className="login-btn">
              Edit Build
            </Link>
          </div>
        )}

        {/* Comments */}
        {build.is_public && (
          <CommentThread buildId={build.id} userId={userId ?? null} />
        )}
      </div>
    </div>
  );
}
