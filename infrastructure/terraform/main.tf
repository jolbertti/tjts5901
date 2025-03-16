provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "kubernetes_secret" "weather_api_keys" {
  metadata {
    name = "weather-api-secrets"
  }

  data = {
    OPENWEATHER_API_KEY = base64encode(var.OPENWEATHER_API_KEY)
    WEATHERAPI_KEY      = base64encode(var.WEATHERAPI_KEY)
  }

  type = "Opaque"
}

variable "OPENWEATHER_API_KEY" {
  description = "API key for OpenWeatherMap"
  type        = string
}

variable "WEATHERAPI_KEY" {
  description = "API key for WeatherAPI"
  type        = string
}

# --- Backend Deployment ---
resource "kubernetes_deployment" "weather_backend" {
  metadata {
    name   = "weather-backend"
    labels = { app = "weather-backend" }
  }

  spec {
    replicas = 3
    selector {
      match_labels = { app = "weather-backend" }
    }

    template {
      metadata {
        labels = { app = "weather-backend" }
      }

      spec {
        container {
          name  = "weather-backend"
          image = "jolbertti/weatherbackend:latest"

          port {
            container_port = 5000
          }

          env {
            name = "OPENWEATHER_API_KEY"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.weather_api_keys.metadata[0].name
                key  = "OPENWEATHER_API_KEY"
              }
            }
          }

          env {
            name = "WEATHERAPI_KEY"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.weather_api_keys.metadata[0].name
                key  = "WEATHERAPI_KEY"
              }
            }
          }

          resources {
            limits = {
              cpu    = "500m"
              memory = "256Mi"
            }
            requests = {
              cpu    = "250m"
              memory = "128Mi"
            }
          }
        }
      }
    }
  }
}

# --- Backend Service ---
resource "kubernetes_service" "weather_backend_service" {
  metadata {
    name = "weather-backend-service"
  }

  spec {
    selector = {
      app = "weather-backend"
    }

    port {
      port        = 5000
      target_port = 5000
    }

    type = "NodePort"
  }
}

# --- Frontend Deployment ---
resource "kubernetes_deployment" "weather_frontend" {
  metadata {
    name   = "weather-frontend"
    labels = { app = "weather-frontend" }
  }

  spec {
    replicas = 2
    selector {
      match_labels = { app = "weather-frontend" }
    }

    template {
      metadata {
        labels = { app = "weather-frontend" }
      }

      spec {
        container {
          name  = "weather-frontend"
          image = "jolbertti/weatherfrontend:latest"

          port {
            container_port = 5173
          }

          resources {
            limits = {
              cpu    = "500m"
              memory = "256Mi"
            }
            requests = {
              cpu    = "250m"
              memory = "128Mi"
            }
          }
        }
      }
    }
  }
}

# --- Frontend Service ---
resource "kubernetes_service" "weather_frontend_service" {
  metadata {
    name = "weather-frontend-service"
  }

  spec {
    selector = {
      app = "weather-frontend"
    }

    port {
      port        = 5173
      target_port = 5173
    }

    type = "NodePort"
  }
}
