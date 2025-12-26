use envconfig::Envconfig;

/// Application configuration loaded from environment variables.
#[derive(Debug, Clone, Envconfig)]
pub struct Config {
    /// Convex backend URL
    #[envconfig(from = "CONVEX_URL", default = "http://127.0.0.1:3210")]
    pub convex_url: String,
}

impl Config {
    /// Load configuration from environment variables.
    ///
    /// Attempts to load from `.env.local` and `.env` files first.
    pub fn load() -> anyhow::Result<Self> {
        dotenvy::from_filename("../.env.local").ok();
        dotenvy::from_filename(".env.local").ok();
        dotenvy::dotenv().ok();

        Ok(Self::init_from_env()?)
    }
}
