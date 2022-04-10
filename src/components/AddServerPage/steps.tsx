import { HelperAPI, Invite, VerificationLevels } from '@uoa-discords/shared-utils';
import moment from 'moment';

const verificationLevelNameMap: Record<VerificationLevels, string> = {
    [VerificationLevels.NONE]: 'no',
    [VerificationLevels.LOW]: 'low',
    [VerificationLevels.MEDIUM]: 'medium',
    [VerificationLevels.HIGH]: 'high',
    [VerificationLevels.VERY_HIGH]: 'very high',
};

export interface StepReturn {
    /** Whether the invite passed the test.
     *
     * If null, the test will show as warning, but will still count as a pass.
     */
    passes: boolean | null;

    /** Text content to display. */
    content: string | JSX.Element;

    /** Optional tooltip to display. */
    tooltip?: string;
}

export type StepCallback = (i: Invite) => StepReturn;

export const steps: StepCallback[] = [
    ({ expires_at }) => {
        if (expires_at) {
            return {
                passes: false,
                content: (
                    <>
                        Invite <span style={{ color: 'lightcoral' }}>expires {moment(expires_at).fromNow()}</span>
                    </>
                ),
                tooltip: 'Can only apply with permanent invites',
            };
        } else
            return {
                passes: true,
                content: (
                    <>
                        Invite <span style={{ color: 'lightgreen' }}>never</span> expires
                    </>
                ),
            };
    },
    ({ approximate_member_count }) => {
        if (approximate_member_count < HelperAPI.MIN_ACCEPTABLE_MEMBERS) {
            return {
                passes: false,
                content: (
                    <>
                        Has{' '}
                        <span style={{ color: 'lightcoral' }}>
                            {approximate_member_count} / {HelperAPI.MIN_ACCEPTABLE_MEMBERS}
                        </span>{' '}
                        members
                    </>
                ),
                tooltip: `Must have at least ${HelperAPI.MIN_ACCEPTABLE_MEMBERS} members`,
            };
        } else
            return {
                passes: true,
                content: (
                    <>
                        Has{' '}
                        <span style={{ color: 'lightgreen' }}>
                            {approximate_member_count} / {HelperAPI.MIN_ACCEPTABLE_MEMBERS}
                        </span>{' '}
                        members
                    </>
                ),
            };
    },
    ({ guild }) => {
        if (!guild) {
            return {
                passes: false,
                content: 'Unknown server',
                tooltip: 'Failed to get server data',
            };
        }
        if (guild.icon) {
            return {
                passes: true,
                content: <>Has a server icon</>,
            };
        }
        return {
            passes: false,
            content: <>No server icon</>,
        };
    },
    ({ guild }) => {
        if (guild?.verification_level === undefined) {
            return {
                passes: false,
                content: 'Unknown verification level',
                tooltip: 'Failed to get verification level data',
            };
        }
        if (guild.verification_level >= VerificationLevels.LOW)
            return {
                passes: true,
                content: (
                    <>
                        Has a{' '}
                        <span style={{ color: 'lightgreen' }}>
                            {verificationLevelNameMap[guild.verification_level]}
                        </span>{' '}
                        verification level
                    </>
                ),
            };
        return {
            passes: null,
            content: (
                <>
                    Has <span style={{ color: 'lightcoral' }}>no</span> verification level
                </>
            ),
            tooltip: 'Recommended to be low or greater',
        };
    },
];
