import Keycloak, { type KeycloakConfig } from "keycloak-js";

export default defineNuxtPlugin((nuxtApp) => {
    const initOptions: KeycloakConfig = {
        url: "http://localhost:8080",
        realm: "myrealm",
        clientId: "my-frontend",
    };

    const keycloak = new Keycloak(initOptions);

    nuxtApp.$keycloak = keycloak;

    keycloak.init({
        onLoad: "check-sso",
    });
});