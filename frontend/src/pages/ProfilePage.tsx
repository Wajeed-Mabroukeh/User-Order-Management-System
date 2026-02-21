import { useEffect, useState } from "react";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../services/http";
import { userApi } from "../services/userApi";
import { UserProfile } from "../types/user";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await userApi.getMyProfile();
      setProfile(response);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  return (
    <section className="page">
      <header className="page-header">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Manage your account details and identity information.</p>
      </header>

      {isLoading ? (
        <Card>
          <Loader label="Loading profile..." />
        </Card>
      ) : null}

      {!isLoading && error ? (
        <Card>
          <Alert variant="error" message={error} />
          <div className="spacer-sm" />
          <Button onClick={loadProfile}>Retry</Button>
        </Card>
      ) : null}

      {!isLoading && !error && profile ? (
        <Card title={profile.name} subtitle="Authenticated user information" className="profile-card">
          <dl className="definition-list">
            <div>
              <dt>Email</dt>
              <dd>{profile.email}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{user?.role ?? "USER"}</dd>
            </div>
            <div>
              <dt>User ID</dt>
              <dd>#{profile.id}</dd>
            </div>
          </dl>
        </Card>
      ) : null}
    </section>
  );
}
