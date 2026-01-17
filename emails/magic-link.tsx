import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { brand, styles } from "@/emails/config";

type Props = {
  url: string;
};

export default function MagicLinkEmail({ url }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Sign in to {brand.name}</Preview>

      <Body style={styles.body}>
        <Container style={styles.card}>
          <Section style={styles.header}>
            <Img
              src={brand.logoUrl}
              alt={brand.name}
              width={72}
              height={72}
              style={styles.logo}
            />
            <Text style={styles.title}>Sign In to {brand.name}</Text>
          </Section>

          <Section>
            <Text style={styles.paragraph}>
              Click the button below to sign in to your account. This link will
              expire in 15 minutes.
            </Text>
          </Section>

          <Section style={styles.buttonContainer}>
            <Button href={url} style={styles.button}>
              Sign In
            </Button>
          </Section>

          <Section>
            <Text style={styles.muted}>
              Or copy and paste this link into your browser:
            </Text>
            <Link href={url} style={styles.link}>
              {url}
            </Link>
          </Section>

          <Hr style={styles.divider} />

          <Section>
            <Text style={styles.securityTitle}>Security Notice</Text>
            <Text style={styles.securityText}>
              This link expires in 15 minutes.
              <br />
              If you didn't request this, you can safely ignore the email.
            </Text>
          </Section>
        </Container>

        <Container style={styles.footer}>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </Text>
          <Text style={styles.footerText}>
            This is an automated message from {brand.name}.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
