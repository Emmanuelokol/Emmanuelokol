import { Component } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import type { ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  label?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Catches render errors and displays them instead of a blank screen.
 * This is critical for debugging — React Native swallows errors silently
 * when no boundary exists, resulting in an empty white screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    console.error(
      `[ErrorBoundary${this.props.label ? `:${this.props.label}` : ""}] Caught error:`,
      error.message
    );
    console.error("[ErrorBoundary] Component stack:", errorInfo.componentStack);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>!</Text>
          </View>

          <Text style={styles.heading}>Something went wrong</Text>
          <Text style={styles.subtext}>
            The app ran into a problem. The details below can help fix it.
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={this.handleRetry}
            activeOpacity={0.7}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>

          <View style={styles.errorBox}>
            <Text style={styles.errorLabel}>Error</Text>
            <Text style={styles.errorMessage} selectable>
              {this.state.error?.message ?? "Unknown error"}
            </Text>

            {this.state.error?.stack ? (
              <>
                <Text style={styles.errorLabel}>Stack</Text>
                <Text style={styles.stackText} selectable>
                  {this.state.error.stack.slice(0, 1500)}
                </Text>
              </>
            ) : null}

            {this.state.errorInfo?.componentStack ? (
              <>
                <Text style={styles.errorLabel}>Component Stack</Text>
                <Text style={styles.stackText} selectable>
                  {this.state.errorInfo.componentStack.slice(0, 1000)}
                </Text>
              </>
            ) : null}
          </View>
        </ScrollView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEF2F2",
  },
  content: {
    padding: 24,
    paddingTop: 80,
    alignItems: "center",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  iconText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#991B1B",
    marginBottom: 8,
    textAlign: "center",
  },
  subtext: {
    fontSize: 15,
    color: "#7F1D1D",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  retryButton: {
    minHeight: 48,
    paddingHorizontal: 32,
    backgroundColor: "#DC2626",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  retryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  errorBox: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#DC2626",
    textTransform: "uppercase",
    marginTop: 12,
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "500",
    lineHeight: 20,
  },
  stackText: {
    fontSize: 11,
    color: "#6B7280",
    lineHeight: 16,
  },
});
