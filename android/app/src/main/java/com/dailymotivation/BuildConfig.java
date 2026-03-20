package com.dailymotivation;

/**
 * Shim for React Native autolinking entrypoint generation.
 *
 * Our real BuildConfig is in `com.kwikitt.dailymotivation`, but the generated
 * `ReactNativeApplicationEntryPoint` is still referencing this package name.
 * This class provides only the flags needed by that entrypoint.
 */
public final class BuildConfig {
  public static final boolean IS_NEW_ARCHITECTURE_ENABLED = true;
  public static final boolean IS_EDGE_TO_EDGE_ENABLED = false;
}

