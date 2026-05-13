import { Link } from 'react-router-dom';
import { ArrowRight, Search, Users, Calendar, ShieldCheck } from 'lucide-react';

const Landing = () => {
  return (
    <div className="container">
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '80px 0', position: 'relative' }}>
        {/* Background glow effect */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '300px', height: '300px', background: 'var(--accent-purple)', filter: 'blur(150px)', opacity: '0.4', zIndex: -1, borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', top: '20%', left: '30%', width: '200px', height: '200px', background: 'var(--accent-pink)', filter: 'blur(120px)', opacity: '0.3', zIndex: -1, borderRadius: '50%' }}></div>

        <h1 style={{ fontSize: '64px', fontWeight: '800', marginBottom: '24px', letterSpacing: '-1px' }}>
          Your Campus, <span className="gradient-text">Connected.</span>
        </h1>
        <p style={{ fontSize: '20px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>
          The digital layer for verified university students. From honest reviews to campus events and student marketplaces. No outsiders. No noise.
        </p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/reviews" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '18px' }}>
            Looking for Admissions?
            <ArrowRight size={20} />
          </Link>
          <Link to="/events" className="btn btn-secondary" style={{ padding: '16px 32px', fontSize: '18px' }}>
            Already Enrolled?
          </Link>
        </div>
      </section>

      {/* Pillars Section */}
      <section style={{ padding: '60px 0' }}>
        <h2 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '48px' }}>Platform <span className="gradient-text">Pillars</span></h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
          <div className="glass-card">
            <div style={{ background: 'rgba(128, 90, 213, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <ShieldCheck size={28} color="var(--accent-purple)" />
            </div>
            <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Identity & Trust</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Tied to your .edu domain. Verified students only. Say goodbye to anonymous trolls and outside noise.
            </p>
          </div>

          <div className="glass-card">
            <div style={{ background: 'rgba(237, 100, 166, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Search size={28} color="var(--accent-pink)" />
            </div>
            <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Honest Feedback</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Course ratings, faculty reviews, and an actionable grievance tracker for real campus changes.
            </p>
          </div>

          <div className="glass-card">
            <div style={{ background: 'rgba(49, 130, 206, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Users size={28} color="var(--accent-blue)" />
            </div>
            <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Career & Internships</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Find the best internship opportunities and industrial visits tailored for your university.
            </p>
          </div>

          <div className="glass-card">
            <div style={{ background: 'rgba(128, 90, 213, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Calendar size={28} color="var(--accent-purple)" />
            </div>
            <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Events & Activities</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Centralized events calendar, esports tournaments, and industrial visits. Never miss out on campus life again.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="glass-card" style={{ margin: '80px 0', textAlign: 'center', padding: '60px 20px', background: 'linear-gradient(135deg, rgba(107, 70, 193, 0.1), rgba(213, 63, 140, 0.1))', borderColor: 'rgba(213, 63, 140, 0.2)' }}>
        <h2 style={{ fontSize: '40px', marginBottom: '16px' }}>Ready to join your campus?</h2>
        <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
          Verify your student status with your university email and unlock the full ecosystem.
        </p>
        <button className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '16px' }}>
          Connect Your Uni ID
        </button>
      </section>
    </div>
  );
};

export default Landing;
