"use client";

import { useEffect, useRef, useState } from "react";

type GenerateResponse = {
  markdown?: string;
  error?: string;
};

type TranscribeResponse = {
  transcript?: string;
  error?: string;
};

export function InterviewWriterForm() {
  const [accessToken, setAccessToken] = useState("");
  const [person, setPerson] = useState("");
  const [role, setRole] = useState("");
  const [project, setProject] = useState("");
  const [keywords, setKeywords] = useState("");
  const [direction, setDirection] = useState("");
  const [transcript, setTranscript] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState("");

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
      }
    };
  }, [audioPreviewUrl]);

  function ensureToken(): boolean {
    if (accessToken.trim()) {
      return true;
    }

    setErrorMessage("Access token is required.");
    return false;
  }

  async function startRecording() {
    setErrorMessage("");

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setErrorMessage("Media recording is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const useWebm =
        typeof MediaRecorder.isTypeSupported === "function" &&
        MediaRecorder.isTypeSupported("audio/webm");
      const recorder = useWebm
        ? new MediaRecorder(stream, { mimeType: "audio/webm" })
        : new MediaRecorder(stream);

      chunksRef.current = [];
      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        setRecordedAudio(blob);
        setAudioPreviewUrl((prev) => {
          if (prev) {
            URL.revokeObjectURL(prev);
          }
          return URL.createObjectURL(blob);
        });

        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setIsRecording(false);
      };

      recorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setErrorMessage("Unable to access microphone.");
    }
  }

  function stopRecording() {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      return;
    }

    recorder.stop();
  }

  async function transcribeAudio() {
    setErrorMessage("");

    if (!ensureToken()) {
      return;
    }

    if (!recordedAudio) {
      setErrorMessage("Record audio before transcribing.");
      return;
    }

    setIsTranscribing(true);

    try {
      const formData = new FormData();
      formData.set(
        "audio",
        new File([recordedAudio], "recording.webm", {
          type: recordedAudio.type || "audio/webm",
        }),
      );

      const response = await fetch("/api/interview/transcribe", {
        method: "POST",
        headers: {
          "x-studio-token": accessToken.trim(),
        },
        body: formData,
      });

      const body = (await response.json()) as TranscribeResponse;

      if (!response.ok) {
        throw new Error(body.error || "Failed to transcribe audio.");
      }

      setTranscript(body.transcript || "");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to transcribe audio.");
    } finally {
      setIsTranscribing(false);
    }
  }

  async function generateMarkdown() {
    setErrorMessage("");

    if (!ensureToken()) {
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/interview/generate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-studio-token": accessToken.trim(),
        },
        body: JSON.stringify({
          person,
          role,
          project,
          keywords,
          direction,
          transcript,
        }),
      });

      const body = (await response.json()) as GenerateResponse;

      if (!response.ok) {
        throw new Error(body.error || "Failed to generate markdown.");
      }

      setMarkdown(body.markdown || "");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to generate markdown.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function copyMarkdown() {
    if (!markdown) {
      return;
    }

    try {
      await navigator.clipboard?.writeText(markdown);
    } catch {
      setErrorMessage("Failed to copy markdown.");
    }
  }

  return (
    <section style={{ maxWidth: 920, margin: "0 auto", padding: "2rem 1rem", display: "grid", gap: "1rem" }}>
      <h1>Interview Writer Studio</h1>

      <label>
        Access token
        <input
          aria-label="Access token"
          type="password"
          value={accessToken}
          onChange={(event) => setAccessToken(event.target.value)}
          style={{ display: "block", width: "100%", marginTop: 6 }}
        />
      </label>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <label>
          Person
          <input
            aria-label="Person"
            value={person}
            onChange={(event) => setPerson(event.target.value)}
            style={{ display: "block", width: "100%", marginTop: 6 }}
          />
        </label>
        <label>
          Role
          <input
            aria-label="Role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            style={{ display: "block", width: "100%", marginTop: 6 }}
          />
        </label>
        <label>
          Project
          <input
            aria-label="Project"
            value={project}
            onChange={(event) => setProject(event.target.value)}
            style={{ display: "block", width: "100%", marginTop: 6 }}
          />
        </label>
        <label>
          Keywords
          <input
            aria-label="Keywords"
            value={keywords}
            onChange={(event) => setKeywords(event.target.value)}
            style={{ display: "block", width: "100%", marginTop: 6 }}
          />
        </label>
      </div>

      <label>
        Direction
        <input
          aria-label="Direction"
          value={direction}
          onChange={(event) => setDirection(event.target.value)}
          style={{ display: "block", width: "100%", marginTop: 6 }}
        />
      </label>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button type="button" onClick={startRecording} disabled={isRecording}>
          Start recording
        </button>
        <button type="button" onClick={stopRecording} disabled={!isRecording}>
          Stop recording
        </button>
        <button type="button" onClick={transcribeAudio} disabled={isTranscribing}>
          {isTranscribing ? "Transcribing..." : "Transcribe audio"}
        </button>
      </div>

      {audioPreviewUrl ? (
        <audio controls src={audioPreviewUrl}>
          <track kind="captions" />
        </audio>
      ) : null}

      <label>
        Transcript
        <textarea
          aria-label="Transcript"
          value={transcript}
          onChange={(event) => setTranscript(event.target.value)}
          rows={10}
          style={{ display: "block", width: "100%", marginTop: 6 }}
        />
      </label>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button type="button" onClick={generateMarkdown} disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate markdown"}
        </button>
        <button type="button" onClick={copyMarkdown}>
          Copy markdown
        </button>
      </div>

      {errorMessage ? (
        <p role="alert" style={{ color: "#b00020" }}>
          {errorMessage}
        </p>
      ) : null}

      <label>
        Markdown result
        <textarea
          aria-label="Markdown result"
          readOnly
          value={markdown}
          rows={14}
          style={{ display: "block", width: "100%", marginTop: 6 }}
        />
      </label>
    </section>
  );
}
