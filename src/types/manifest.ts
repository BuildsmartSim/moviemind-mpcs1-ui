export type Quadrant = 'HV_HA' | 'HV_LA' | 'LV_HA' | 'LV_LA' | 'Neutral';

export interface EntryGate {
  gateId: string;
  image: string;
  seedAxes: string[];
}

export type TextCardOptionId = 'A' | 'B' | 'C';

export interface TextRoundData {
  roundLabel?: string;
  vignette: string[];
  options: { id: TextCardOptionId; text: string }[];
}

export interface GateRound {
  R1_images: string[];
  R2_text_card: TextRoundData;
  R3_images: string[];
  R4_text_card: TextRoundData;
  R5_images: string[] | 'reuse_A+B_curated_4';
  R6_text_card: TextRoundData;
}

export interface GateManifest {
  id: string;
  name: string;
  quadrant: Quadrant;
  rounds: GateRound;
}

export interface MPCS1Manifest {
  version: string;
  shared: {
    text_card: string;
  };
  entry_round: EntryGate[];
  scoring_keys: Record<'R0' | 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6', string[]>;
  gates: GateManifest[];
}

export interface RoundAnswerMap {
  [round: string]: string | undefined;
}
