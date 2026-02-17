'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useCanvasStore } from '@/store/useCanvasStore';

export default function VoiceInput() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const addNode = useCanvasStore((state: any) => state.addNode);
    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            // @ts-ignore
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event: any) => {
                const current = event.resultIndex;
                const transcript = event.results[current][0].transcript;
                setTranscript(transcript);
            };

            recognition.onend = () => {
                setIsListening(false);
                if (transcript.trim()) {
                    processVoiceInput(transcript);
                }
                setTranscript('');
            };

            setRecognition(recognition);
        }
    }, [transcript]);

    const processVoiceInput = (text: string) => {
        // Simple Sentiment Analysis
        let sentiment = 'neutral';
        const lowerText = text.toLowerCase();

        if (lowerText.match(/urgent|important|critical|problem|error|fail/)) {
            sentiment = 'negative';
        } else if (lowerText.match(/great|cool|awesome|idea|solution|success/)) {
            sentiment = 'positive';
        }

        // Create Node
        const colorMap: Record<string, string> = {
            negative: '#fee2e2', // Red-ish
            positive: '#dcfce7', // Green-ish
            neutral: '#ffffff'
        };

        addNode({
            id: crypto.randomUUID(),
            content: text,
            x: 0 + Math.random() * 100,
            y: 0 + Math.random() * 100,
            type: 'default',
            style: { backgroundColor: colorMap[sentiment] }, // We might need to handle this in NodeComponent or just pass generic props
            confidence: 100,
            reasoning: `Voice Input (${sentiment} sentiment detected)`
        });
    };

    const toggleListening = () => {
        if (!recognition) {
            alert("Speech recognition not supported in this browser. Try Chrome.");
            return;
        }

        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
            setIsListening(true);
        }
    };

    if (!recognition) return null; // Hide if not supported

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '8px 16px',
            borderRadius: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.5)'
        }}>
            <button
                onClick={toggleListening}
                style={{
                    border: 'none',
                    background: isListening ? '#ef4444' : '#1a1a1a',
                    color: 'white',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)'
                }}
            >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            {isListening && (
                <span style={{ fontSize: '0.9rem', color: '#333', minWidth: '100px' }}>
                    {transcript || "Listening..."}
                </span>
            )}
            {!isListening && (
                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                    Tap to speak
                </span>
            )}
        </div>
    );
}
