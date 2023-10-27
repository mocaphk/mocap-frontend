/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.(tsx|graphql|gql)$/,
            use: [
                options.defaultLoaders.babel,
                { loader: "graphql-let/loader" },
            ],
        });

        return config;
    },
    reactStrictMode: true,
};

module.exports = nextConfig;
