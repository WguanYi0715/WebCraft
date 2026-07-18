import { Container } from "@/components/ui";
import { growthSteps } from "../content";

export function GrowthFlow() {
  return (
    <section aria-labelledby="growth-flow-title" className="home-section home-growth">
      <Container size="default">
        <div className="home-section__header">
          <p className="home-section__eyebrow">Growth flow</p>
          <h2 className="home-section__title" id="growth-flow-title">
            From a resource to a coherent experience.
          </h2>
          <p className="home-section__description">
            This is the intended integration path, not a claim that automatic GitHub intake exists today.
          </p>
        </div>

        <ol className="home-growth-flow">
          {growthSteps.map((step, index) => (
            <li className="home-growth-flow__step wc-surface" key={step.title}>
              <span className="home-growth-flow__index">0{index + 1}</span>
              <h3 className="home-growth-flow__title">{step.title}</h3>
              <p className="home-growth-flow__description">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
