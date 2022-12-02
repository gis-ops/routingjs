import React from "react"
import clsx from "clsx"
import styles from "./styles.module.css"

type FeatureItem = {
    title: string
    Svg: React.ComponentType<React.ComponentProps<"svg">>
    description: JSX.Element
}

const FeatureList: FeatureItem[] = [
    {
        title: "Quick setup",
        Svg: require("@site/static/img/settings-off.svg").default,
        description: (
            <>
                Hook into public APIs of Valhalla, OSRM, GraphHopper* and
                OpenRouteService* with no setup.
            </>
        ),
    },
    {
        title: "A unified API",
        Svg: require("@site/static/img/switch-3.svg").default,
        description: (
            <>
                With routing-js it has never been easier to switch between
                different routing engines.
            </>
        ),
    },
    {
        title: "The Power of TypeScript",
        Svg: require("@site/static/img/braces.svg").default,
        description: (
            <>
                Full code completion in your IDE for all API's parameters,
                thanks to TypeScript, even if you use JavaScript.
            </>
        ),
    },
]

function Feature({ title, Svg, description }: FeatureItem) {
    return (
        <div className={clsx("col col--4")}>
            <div className="text--center">
                <Svg className={styles.featureSvg} role="img" />
            </div>
            <div className="text--center padding-horiz--md">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    )
}

export default function HomepageFeatures(): JSX.Element {
    return (
        <>
            <section className={styles.features}>
                <div className="container">
                    <div className="row">
                        {FeatureList.map((props, idx) => (
                            <Feature key={idx} {...props} />
                        ))}
                    </div>
                </div>
            </section>
            <div className={styles.smallprint}>* API keys required</div>
        </>
    )
}
