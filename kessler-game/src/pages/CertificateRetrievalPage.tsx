import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { generateCertificate } from '../utils/certificate';

interface CertificateData {
  playerName: string;
  finalScore: number;
  grade: string;
  turnsSurvived: number;
  maxTurns: number;
  finalBudget: number;
  satellitesLaunched: number;
  debrisRemoved: number;
  totalDebris: number;
  difficulty: string;
  scoreBreakdown: {
    satelliteLaunchScore: number;
    debrisRemovalScore: number;
    satelliteRecoveryScore: number;
    budgetManagementScore: number;
    survivalScore: number;
  };
  certificateId: string;
  createdAt: string;
}

interface CertificateState {
  status: 'loading' | 'found' | 'not_found' | 'error';
  certificate?: CertificateData;
  error?: string;
}

export function CertificateRetrievalPage() {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<CertificateState>({ status: 'loading' });

  useEffect(() => {
    const fetchCertificate = async () => {
      if (!id) {
        setState({ status: 'error', error: 'Invalid certificate ID' });
        return;
      }

      try {
        const res = await fetch(`/api/certificates/${id}?format=json`);
        const data = await res.json();
        
        if (data.success) {
          setState({ status: 'found', certificate: data.certificate });
        } else {
          setState({ status: 'not_found', error: data.error });
        }
      } catch (error) {
        setState({ status: 'error', error: (error as Error).message });
      }
    };

    fetchCertificate();
  }, [id]);

  const handleDownload = async () => {
    if (!state.certificate) return;
    
    await generateCertificate({
      playerName: state.certificate.playerName,
      finalScore: state.certificate.finalScore,
      grade: state.certificate.grade,
      turnsSurvived: state.certificate.turnsSurvived,
      maxTurns: state.certificate.maxTurns,
      finalBudget: state.certificate.finalBudget,
      satellitesLaunched: state.certificate.satellitesLaunched,
      debrisRemoved: state.certificate.debrisRemoved,
      totalDebris: state.certificate.totalDebris,
      difficulty: state.certificate.difficulty,
      satelliteLaunchScore: state.certificate.scoreBreakdown.satelliteLaunchScore,
      debrisRemovalScore: state.certificate.scoreBreakdown.debrisRemovalScore,
      satelliteRecoveryScore: state.certificate.scoreBreakdown.satelliteRecoveryScore,
      budgetManagementScore: state.certificate.scoreBreakdown.budgetManagementScore,
      survivalScore: state.certificate.scoreBreakdown.survivalScore,
    });
  };

  if (state.status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading certificate...</div>
      </div>
    );
  }

  if (state.status === 'not_found' || state.status === 'error') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-deep-space-300 border-none p-8 max-w-md w-full border border-red-500/50">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Certificate Not Found</h1>
          <p className="text-gray-300 mb-4">
            {state.error || 'This certificate may have expired or the link is invalid.'}
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Certificates are valid for 90 days after creation.
          </p>
          <Link
            to="/"
            className="block w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-center transition-all"
          >
            🚀 Play the Game
          </Link>
        </div>
      </div>
    );
  }

  const { certificate } = state;

  if (!certificate) return null;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-deep-space-300 border-none p-8 max-w-2xl w-full border border-slate-700">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          🎖️ Mission Certificate
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Space Debris Management Program
        </p>

        <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-2 border-purple-500/50 border-none p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">{certificate.playerName}</h2>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Grade</p>
              <p className="text-2xl font-bold text-yellow-400">{certificate.grade}</p>
            </div>
            <div>
              <p className="text-gray-400">Final Score</p>
              <p className="text-2xl font-bold text-blue-400">
                {certificate.finalScore.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Turns Survived</p>
              <p className="text-lg text-white">
                {certificate.turnsSurvived} / {certificate.maxTurns}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Difficulty</p>
              <p className="text-lg text-white capitalize">{certificate.difficulty}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white border-none font-bold text-xl transition-all shadow-lg hover:shadow-xl mb-4"
        >
          📄 Download Certificate PDF
        </button>

        <Link
          to="/"
          className="block w-full py-3 bg-deep-space-100 hover:bg-slate-600 text-white border-none font-semibold text-center transition-all"
        >
          🚀 Play the Game
        </Link>

        <p className="text-xs text-gray-500 text-center mt-4">
          This certificate will expire on {new Date(new Date(certificate.createdAt).getTime() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
