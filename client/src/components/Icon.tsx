import * as icons from "react-bootstrap-icons";
import React from "react";
import { ButtonVariant } from "react-bootstrap/types";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";

interface IconProps extends icons.IconProps {
    variant?: ButtonVariant;
    iconName: keyof typeof icons;
    link?: string;
    onClick?: () => void;
    buttonClassname?: string;
}

const Tool = ({ children, tooltip }: { children: any, tooltip?: any }) => {
    return tooltip ? <OverlayTrigger overlay={<Tooltip>{tooltip}</Tooltip>}>{children}</OverlayTrigger> : children;
}

const Href = ({ children, link }: { children: any, link?: string }) => {
    return link ? <Link to={link}>{children}</Link> : children
}

export const Icon = ({ variant, iconName, link, onClick, buttonClassname, children, ...props }: IconProps) => {
    const BootstrapIcon = icons[iconName];
    return (
        <Href link={link}>
            <Tool tooltip={children}>
                <Button variant={variant} onClick={onClick} className={buttonClassname}>
                    <BootstrapIcon {...props}/>
                </Button>
            </Tool>
        </Href>
    );
}
